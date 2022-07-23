import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';

import en from '../common/translations/en'
import pl from '../common/translations/pl'

const LANGUAGES = {
    en,
    pl
  };

const LANG_CODES = Object.keys(LANGUAGES);
const FALLBACK_LANGUAGE = 'pl'

interface LanguageDetector  {
    type: any;
    async: boolean;
    detect: (callback: any) => void;
    init: () => void;
    cacheUserLanguage: (language: string) => void;
}

const LANGUAGE_DETECTOR: LanguageDetector = {
    type: 'languageDetector',
    async: true,
    detect: (callback) => {
      AsyncStorage.getItem('user-language', (err, language) => {
        // if error fetching stored data or no language was stored
        // display errors when in DEV mode as console statements
        if (err || !language) {
          if (err) {
            console.log('Error fetching Languages from asyncstorage ', err);
          } 
          const findBestAvailableLanguage =
            RNLocalize.findBestAvailableLanguage(LANG_CODES);
  
          callback(findBestAvailableLanguage?.languageTag || FALLBACK_LANGUAGE);
          return;
        }
        callback(language);
      });
    },
    init: () => {},
    cacheUserLanguage: language => {
      AsyncStorage.setItem('user-language', language);
    }
  };

  i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    resources: LANGUAGES,
    react: {
      useSuspense: false
    },
    interpolation: {
      escapeValue: false
    },
    defaultNS: 'common'
  });
