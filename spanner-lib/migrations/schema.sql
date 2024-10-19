CREATE TABLE Albums (
    SingerId INT64 NOT NULL,
    AlbumId INT64 NOT NULL,
    AlbumTitle STRING(MAX),
    MarketingBudget INT64,
) PRIMARY KEY(SingerId, AlbumId);

CREATE TABLE FlashcardSets (
    SetId STRING(36) NOT NULL,
    CreatorId STRING(36) NOT NULL,
    Title STRING(100) NOT NULL,
    Description STRING(1000),
    CreatedAt TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp = true),
    UpdatedAt TIMESTAMP OPTIONS (allow_commit_timestamp = true),
) PRIMARY KEY(SetId);

CREATE INDEX FlashcardSetsByCreator ON FlashcardSets(CreatorId);

CREATE TABLE Roles (RoleId INT64, Name STRING(36),) PRIMARY KEY(RoleId);

CREATE TABLE Terms (
    TermId STRING(36) NOT NULL,
    SetId STRING(36) NOT NULL,
    Question STRING(1000) NOT NULL,
    Answer STRING(1000) NOT NULL,
    CreatedAt TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp = true),
    UpdatedAt TIMESTAMP OPTIONS (allow_commit_timestamp = true),
    FOREIGN KEY(SetId) REFERENCES FlashcardSets(SetId),
) PRIMARY KEY(TermId);

CREATE INDEX TermsBySet ON Terms(SetId);

CREATE TABLE Terms2 (
    set_id STRING(36) NOT NULL,
    id STRING(36) NOT NULL,
    term STRING(MAX) NOT NULL,
    definition STRING(MAX) NOT NULL,
    photo STRING(1024) NOT NULL,
    term_crc INT64 NOT NULL,
    rank INT64 NOT NULL,
    last_modified TIMESTAMP NOT NULL,
    is_deleted INT64 NOT NULL,
    term_custom_audio_id INT64,
    definition_custom_audio_id INT64,
) PRIMARY KEY(set_id, id);

CREATE TABLE Users (
    UserId STRING(36) NOT NULL,
    Username STRING(50) NOT NULL,
    Email STRING(100) NOT NULL,
    CreatedAt TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp = true),
    UpdatedAt TIMESTAMP OPTIONS (allow_commit_timestamp = true),
) PRIMARY KEY(UserId);

ALTER TABLE
    FlashcardSets
ADD
    FOREIGN KEY(CreatorId) REFERENCES Users(UserId);