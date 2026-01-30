# 🎲 Bingo Card Generator

A fully responsive, client-side web application for creating, customizing, and downloading print-ready bingo cards. Built with **pure HTML, CSS, and Vanilla JavaScript** using React 19 and Tailwind CSS.

## ✨ Features

### Core Functionality

**Step 1: Card Structure Configuration**
- Select grid size: 3×3, 4×4, 5×5, or 6×6
- Choose number of cards: 1–100
- Automatic calculation of required unique words
- Clear validation messaging

**Step 2: Word Input & Data Handling**
- **Manual Input**: Single-line (comma-separated) or multi-line (one word per line) text entry
- **File Upload**: Support for CSV and XLSX (Excel) files
- **Auto-detection**: Automatically detects columns in uploaded files
- **Column Selection**: Choose which column to use for words
- **Data Preview**: View uploaded data before processing
- **Validation**: Automatic trimming, duplicate removal, and empty row filtering
- **Live Word Count**: Real-time indicator of loaded words vs. required words

**Step 3: Bingo Card Configuration**
- Allow word repetition across cards (toggle, default: ON)
- Prevent duplicate words within the same card (mandatory)
- No FREE cell logic (all cells contain words)

**Step 4: Card Size Controls**
- Presets: A4, Letter, Custom
- Custom dimensions: Width and height in pixels or millimeters
- Responsive scaling

**Step 5: Styling & Design Controls**
- **Card Border**: Outer border thickness (0–20px) and color picker
- **Grid & Cells**: 
  - Toggle grid lines on/off
  - Grid line thickness (0–5px) and color
  - Cell padding adjustment
- **Typography & Colors**:
  - Font family selection (Arial, Times New Roman, Poppins, Montserrat, Roboto)
  - Font color picker
  - Card background color picker
- **Shape**: Rounded corners (0–30px)
- **Live Preview**: Real-time updates as you adjust settings

**Step 6: Logo Upload & Placement**
- Upload PNG, JPG, or SVG logos
- Resize slider (5–40% of card width)
- Toggle logo visibility on cards
- Bottom-center placement (non-overlapping with grid)
- Safe handling when no logo is uploaded

**Step 7: Card Generation & Download**
- Generate randomized bingo cards with unique words per card
- **Download Options**:
  - **PDF**: One card per page, print-ready, high-resolution
  - **PNGs**: Individual high-resolution image files
  - **ZIP**: All PNGs compressed in one file
- **Card Management**:
  - Scrollable card grid
  - Delete individual cards
  - Regenerate all cards
  - Re-download without regenerating

### Live Preview System
- Real-time preview of sample card
- Zoom controls: 50%, 75%, 100%, 125%
- Updates instantly with any styling change
- Responsive preview panel

### Advanced Features
- **Error Handling**: Comprehensive validation with user-friendly error messages
- **Edge Case Management**:
  - Missing logo: Safe skip with no layout breaks
  - Insufficient words: Generation blocked with clear messaging
  - Excess words: Automatic shuffling and selection
- **No Runtime Errors**: Robust error handling throughout the application
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠 Tech Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4 with custom design tokens
- **File Handling**: 
  - PapaParse (CSV parsing)
  - XLSX (Excel file handling)
- **Export**:
  - html2canvas (PNG generation)
  - jsPDF (PDF generation)
  - JSZip (ZIP compression)
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and pnpm

### Install Dependencies
```bash
pnpm install
```

### Development Server
```bash
pnpm dev
```

The application will be available at `http://localhost:3000/`

### Production Build
```bash
pnpm build
```

### Type Checking
```bash
pnpm check
```

## 🎨 Design System

The application follows a **Modern Playful Utility** design philosophy with:

- **Color Palette**: Vibrant teal (#0891B2) with warm coral accents (#F97316)
- **Typography**: Poppins (bold headings) + Inter (body text)
- **Layout**: Two-column asymmetric design (controls + live preview)
- **Spacing**: Generous whitespace with 2rem padding between sections
- **Animations**: Smooth transitions, bounce effects, and subtle pulse animations
- **Accessibility**: High contrast, visible focus states, proper ARIA labels

## 📁 Project Structure

```
client/
  public/              # Static assets
  src/
    pages/
      Home.tsx         # Main application page
    components/
      BingoCardPreview.tsx      # Card rendering component
      GridSizeSelector.tsx      # Grid configuration UI
      WordInputPanel.tsx        # Word input and file upload
      StylingPanel.tsx          # Styling controls
      LogoUploadPanel.tsx       # Logo management
      CardGenerationPanel.tsx   # Download options
    lib/
      bingoUtils.ts    # Card generation and validation logic
      fileUtils.ts     # File parsing and export functions
    index.css          # Global styles and design tokens
    App.tsx            # Main app component with routing
    main.tsx           # React entry point
server/                # Placeholder for static deployment
shared/                # Shared types and constants
package.json
```

## 🚀 Usage Guide

### Basic Workflow

1. **Configure Grid Size**: Select your desired grid size (3×3 to 6×6) and number of cards (1–100)

2. **Add Words**: 
   - Manually type words (comma or line-separated)
   - OR upload a CSV/XLSX file and select the column containing words
   - System validates that you have enough unique words

3. **Customize Appearance**:
   - Adjust borders, grid lines, colors, fonts
   - Watch the live preview update in real-time

4. **Add Logo** (Optional):
   - Upload a PNG, JPG, or SVG file
   - Adjust size and toggle visibility

5. **Generate & Download**:
   - Click "Generate Bingo Cards"
   - Choose your download format (PDF, PNG, or ZIP)
   - Cards are ready to print!

### File Upload Format

**CSV Example:**
```
Word1,Word2,Word3
Apple,Banana,Cherry
Dog,Cat,Bird
```

**XLSX**: First row is treated as header; data starts from row 2.

## 🔒 Data Privacy

All processing happens **client-side only**. No data is sent to any server:
- Words are processed locally
- Cards are generated locally
- Files are downloaded directly to your device
- No tracking or data collection

## ⚠️ Error Handling

The application includes comprehensive error handling for:

- **Insufficient Words**: Clear message indicating how many more words are needed
- **Invalid Files**: Validation of file types and content
- **Missing Logo**: Safe skip with no layout issues
- **Export Failures**: User-friendly error messages with recovery options
- **Edge Cases**: Graceful handling of all edge cases with no console errors

## 🎯 Browser Compatibility

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Code Quality

- **TypeScript**: Full type safety throughout the application
- **Linting**: Code follows consistent style guidelines
- **Testing**: Comprehensive error handling and edge case management
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: Optimized rendering and efficient algorithms

## 🎓 Learning Resources

### Key Utilities
- `bingoUtils.ts`: Card generation algorithms, word validation, size calculations
- `fileUtils.ts`: CSV/XLSX parsing, PNG/PDF/ZIP export functionality

### Component Architecture
- Modular, reusable components following React best practices
- Clear separation of concerns between UI and logic
- Props-based configuration for flexibility

## 🐛 Known Limitations

- Maximum 100 cards per generation (for performance)
- Logo files must be under 5MB
- Export functionality requires modern browser APIs (html2canvas, jsPDF)

## 🔄 Future Enhancements

Potential features for future versions:
- Batch generation with different word sets
- Custom card templates
- Theme presets
- Undo/Redo functionality
- Card numbering options
- Multi-language support

## 📄 License

MIT License - Feel free to use and modify for personal or commercial projects.

## 🤝 Contributing

This is a standalone application. For improvements or bug reports, please document the issue clearly with:
- Steps to reproduce
- Expected vs. actual behavior
- Browser and OS information

## 📞 Support

For issues or questions:
1. Check the error message in the application
2. Verify your input data format
3. Try a different browser if issues persist
4. Review the code comments for implementation details

---

**Built with ❤️ for fun and learning. Happy bingo card generating!** 🎉
