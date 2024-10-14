# Service Level Calculator (SLC)

## Purpose

The Service Level Calculator (SLC) is an interactive web application designed to help engineering teams, product managers, and engineering leaders define and visualize Service Level Indicators (SLIs), Service Level Objectives (SLOs), and alerting strategies. This tool aims to simplify the process of setting up and understanding service reliability metrics.

## Key Features

1. **SLI Configuration**: Define and customize Service Level Indicators.
2. **SLO & Error Budget**: Set Service Level Objectives and visualize error budgets.
3. **Alerting Strategy**: Configure alerting based on burn rates and other metrics.
4. **Interactive UI**: Real-time updates as users adjust parameters.
5. **Examples**: Pre-configured examples to help users get started quickly.
6. **Shareable Results**: Generate shareable links for collaboration.

## Components

The application is built using several React components:

- `Calculator`: The main component that combines SLI, SLO, and Alerting components.
- `SLI`: Allows users to define Service Level Indicators.
- `SLO`: Enables setting Service Level Objectives and visualizing error budgets.
- `Alerting`: Provides controls for configuring alerting strategies.
- `Examples`: Displays pre-configured examples for quick setup.
- `ShareLink`: Generates and displays shareable links.

## Technologies Used

This project is built using modern web technologies:

- **Next.js 14**: React framework for server-side rendering and static site generation.
- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Typed superset of JavaScript for improved developer experience.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Shadcn UI**: A collection of re-usable components built with Radix UI and Tailwind CSS.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).