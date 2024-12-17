# Printable Statblock Generator

A web application for displaying and managing fantasy RPG monster statblocks in a customizable layout. This application is built around the German System Reference Document (SRD) API from [OpenRPG](https://openrpg.de/srd/5e/de/api/) and displays monster data in a printer-friendly format. All monster statistics, abilities, and descriptions are in German.

## Features

- 🎲 Monster selection from the OpenRPG SRD database
- 📱 Responsive grid and column layouts
- 🖨️ Print-friendly design
- 🔍 Search functionality for monsters
- ⚡ Real-time layout switching
- 🎨 Clean and consistent styling using Tailwind CSS
- 🧩 Modular component architecture

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 20 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/garritfra/statblock-generator.git
cd statblock-generator
```

2. Install dependencies:
```bash
npm install
```

## Usage

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`
3. Use the "Monster hinzufügen" button to select monsters
4. Switch between grid and column layouts using the "Layout wechseln" button
5. Print your layout using the "Drucken" button

## API Integration

The application uses the German OpenRPG SRD API ([documentation](https://openrpg.de/srd/5e/de/api/)) to fetch monster data. All endpoints return data in German. The endpoint structure is:

- Monster list: `https://openrpg.de/srd/5e/de/api/monster`
- Individual monster: `https://openrpg.de/srd/5e/de/api/monster/<name>/fantasystatblocks.yaml`

The API returns data in YAML format within `statblock` code blocks.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Claude-React-Jumpstart](https://github.com/Bklieger/Claude-React-Jumpstart) for a way to run Artifacts outside of [claude.ai](https://claude.ai)
- [OpenRPG DE API](https://openrpg.de/srd/5e/de/api/) for providing the monster data API
- shadcn/ui for the component library
- Tailwind CSS for the styling framework

### Support

For support, please open an issue in the repository or contact the maintainers.
