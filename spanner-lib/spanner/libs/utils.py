"""
Utility module for Google Cloud Spanner database operations.
This module provides a SpannerUtil class for initializing a Spanner client,
executing queries, and performing CRUD operations on the database.
"""

import os, pprint, time
from google.cloud import spanner
from google.cloud.spanner_v1 import param_types
from google.cloud.spanner_v1.transaction import Transaction
from google.cloud.spanner_v1.keyset import KeySet
from dotenv import load_dotenv


# Load environment variables
load_dotenv()

class SpannerUtil:
    def __init__(self):
        self.database = self._init_spanner_client()

    def _init_spanner_client(self):
        """
        Initialize and return a Google Cloud Spanner database client.

        Returns:
            google.cloud.spanner_v1.database.Database: A Spanner database instance.
        """
        project_id = os.getenv('GOOGLE_CLOUD_PROJECT')
        instance_id = os.getenv('SPANNER_INSTANCE')
        database_id = os.getenv('SPANNER_DATABASE')
        
        client = spanner.Client(project=project_id)
        instance = client.instance(instance_id)
        return instance.database(database_id)

    # Funtion to receive a function and its arguments
    def run_in_trx(self, func, **kwargs):
        """
        Run a function in a transaction.

        Args:
            func (function): The function to run in the transaction.
            **kwargs: Keyword arguments to pass to the function.

        Returns:
            Any: The return value of the function.
        """
        self.database.run_in_transaction(func, **kwargs)

    # TRANSACTION
    def update_email_qry(self, transaction: Transaction, **kwargs):
        """
        Update the email address for a user in the Users table.

        Args:
            transaction (google.cloud.spanner_v1.transaction.Transaction): A Spanner transaction object.
            **kwargs: Keyword arguments containing the UserId, Username, and Email to update.
        """
        # Extract the keyword arguments
        UserId = kwargs.get("UserId")
        Username = kwargs.get("Username")
        Email = kwargs.get("Email")

        # Create a query to update the email address
        query = """SELECT Email, FROM Users
        WHERE UserId = @UserId"""
        print(f"Query: {query}")
        
        result = transaction.execute_sql(
        query,  # The SQL query is the first positional argument
        params={'UserId': UserId},
        param_types={'UserId': param_types.STRING}
        )
    
        # Safely handle the case where no rows are returned
        try:
            row = result.one()
            print(f"Current email: {row[0]}")
        except StopIteration:
            print("No user found with the given UserId")
            return
        
        transaction.update(
            "Users",
            columns=["UserId", "Email"],
            values=[(UserId, Email)],
        )

    def insert_qry(self, transaction: Transaction, **kwargs):
        """
        Insert queries.
        """
        query = kwargs.get("query")
        row_ct = transaction.execute_update(query)
        print("{} record(s) inserted.".format(row_ct))

    def select_qry(self, transaction: Transaction, **kwargs):
        """
        Select queries.
        """
        query = kwargs.get("query")
        result = transaction.execute_sql(query)
        for row in result:
            pprint.pprint(row)

    def insert_data_qry(self, transaction: Transaction, **kwargs):
        """
        Insert data into a specified table in the Spanner database.

        Args:
            transaction (google.cloud.spanner_v1.transaction.Transaction): A Spanner transaction object.
            **kwargs: Keyword arguments containing the table name, columns, and values to insert.
        """
        table = kwargs.get("table")
        columns = kwargs.get("columns")
        values = kwargs.get("values")

        row_ct = transaction.insert(
            table=table,
            columns=columns,
            values=values
        )
        print("{} record(s) inserted.".format(row_ct))

    def update_data_qry(self, transaction: Transaction, **kwargs):
        """
        Update data in a specified table in the Spanner database.

        Args:
            transaction (google.cloud.spanner_v1.transaction.Transaction): A Spanner transaction object.
            **kwargs: Keyword arguments containing the table name, data, columns, and values.
        """
        table = kwargs.get("table")
        columns = kwargs.get("columns")
        values = kwargs.get("values")

        transaction.update(
            table=table,
            columns=columns,
            values=values
        )
        print("Data updated successfully.")

    # Buggy function says None record(s) deleted
    def delete_data_qry(self, transaction: Transaction, keyset: KeySet, **kwargs):
        """
        Delete data from a specified table in the Spanner database.

        Args:
            transaction (google.cloud.spanner_v1.transaction.Transaction): A Spanner transaction object.
            **kwargs: Keyword arguments containing the table name and keyset.
        """
        table = kwargs.get("table")

        row_ct = transaction.delete(
            table=table,
            keyset=keyset
        )
        print("{} record(s) deleted.".format(row_ct))

    def update_albums(self, transaction):
        # Read the second album budget.
        second_album_keyset = spanner.KeySet(keys=[(2,2)])
        second_album_result = transaction.read(
            table="Albums",
            columns=("MarketingBudget"),
            keyset=second_album_keyset,
            limit=1,
        )
        # second_album_result = 75000

        second_album_row = list(second_album_result)[0]
        second_album_budget = second_album_row[0]

        transfer_amount = 100

        if second_album_budget < transfer_amount:
            # Raising an exception will automatically roll back the
            # transaction.
            raise ValueError("The second album doesn't have enough funds to transfer")

        # Read the first album's budget.
        first_album_keyset = spanner.KeySet(keys=[(1, 1)])
        first_album_result = transaction.read(
            table="Albums",
            columns=("MarketingBudget",),
            keyset=first_album_keyset,
            limit=1,
        )
        # second_album_result = 50000
        first_album_row = list(first_album_result)[0]
        first_album_budget = first_album_row[0]

        # Update the budgets.
        second_album_budget -= transfer_amount
        first_album_budget += transfer_amount
        print(
            "Setting first album's budget to {} and the second album's "
            "budget to {}.".format(first_album_budget, second_album_budget)
        )

        # Update the rows.
        transaction.update(
            table="Albums",
            columns=("SingerId", "AlbumId", "MarketingBudget"),
            values=[(1, 1, first_album_budget), (2, 2, second_album_budget)],
        )

    def replace_data(self, transaction, table, columns, values, keyset: KeySet):
        """
        Replace data in a specified table in the Spanner database.

        Args:
            transaction (google.cloud.spanner_v1.transaction.Transaction): A Spanner transaction object.
            table (str): The name of the table to replace data in.
            columns (list): A list of column names.
            values (list): A list of values to replace.
        """
        transaction.read(table=table, columns=columns, keyset=keyset)
        print("Data selected successfully.")
        # Sleep for 5 seconds to simulate a long-running transaction
        #time.sleep(5)
        transaction.replace(table=table, columns=columns, values=values)
        print("Data replaced successfully.")

    # BATCH
    def batch_insert_update(self, table, columns, inserts, updates): 
        with self.database.batch() as batch:

            # batch.insert(
            #     table=table, columns=columns,
            #     values=inserts)

            batch.update(
                table=table, columns=columns,
                values=updates)
            
            print("Batch insert and update completed.")

    def batch_delete(self, table, values: KeySet): 
        with self.database.batch() as batch:

            batch.delete('Users', values)

            print("Batch delete completed.")


    # SNAPSHOT
    # receive table and query and read from snapshot
    def read_from_snapshot(self, query, exact_staleness):
        # ok to read data from snapshot stale data 5 seconds old
        with self.database.snapshot(exact_staleness=exact_staleness) as snapshot:
            results = snapshot.execute_sql(query)
            return list(results)


    # Defaults
    def update_data(self, table, data, key_column, key_value):
        """
        Update data in a specified table in the Spanner database.

        Args:
            table (str): The name of the table to update data in.
            data (dict): A dictionary containing the data to be updated.
            key_column (str): The name of the column used as the primary key.
            key_value (Any): The value of the primary key for the row to be updated.
        """
        with self.database.batch() as batch:
            batch.update(table=table, columns=data.keys(), values=[data.values()], 
                         keyset={key_column: key_value})

    def delete_data(self, table, key_column, key_value):
        """
        Delete data from a specified table in the Spanner database.

        Args:
            table (str): The name of the table to delete data from.
            key_column (str): The name of the column used as the primary key.
            key_value (Any): The value of the primary key for the row to be deleted.
        """
        with self.database.batch() as batch:
            batch.delete(table=table, keyset={key_column: key_value})

    def read_users(self):
        """
        Read Users table.

        Returns:
            list: A list of tuples containing user data. Each tuple represents a row
                  with the following fields: UserId, Username, Email, CreatedAt, UpdatedAt.
        """
        return self.execute_query(
            "SELECT UserId, Username, Email, CreatedAt, UpdatedAt FROM Users LIMIT 200"
        )

    def read_flashcard_sets(self):
        """
        Read FlashcardSets table.

        Returns:
            list: A list of tuples containing flashcard set data. Each tuple represents a row
                  with the following fields: SetId, CreatorId, Title, Description, CreatedAt, UpdatedAt.
        """
        return self.execute_query(
            "SELECT SetId, CreatorId, Title, Description, CreatedAt, UpdatedAt FROM FlashcardSets LIMIT 200"
        )

    def read_terms(self):
        """
        Read Terms table.

        Returns:
            list: A list of tuples containing term data. Each tuple represents a row
                  with the following fields: TermId, SetId, Question, Answer, CreatedAt, UpdatedAt.
        """
        return self.execute_query(
            "SELECT TermId, SetId, Question, Answer, CreatedAt, UpdatedAt FROM Terms LIMIT 200"
        )
    
    def execute_query(self, query):
        """
        Execute a query on the Spanner database.
        """
        with self.database.snapshot() as snapshot:
            results = snapshot.execute_sql(query)
            return list(results)