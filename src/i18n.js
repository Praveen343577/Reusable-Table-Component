import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        common: { select: "Select..." },
        buttons: { search: "Search..." },
        table: {
          search: "Search...",
          columns: "Columns",
          export: "Export",
          noRecordsFound: "No records found.",
          showing: "Showing",
          of: "of",
          entries: "entries",
          rowsPerPage: "Rows per page:",
          previous: "Previous",
          next: "Next"
        }
      }
    }
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;