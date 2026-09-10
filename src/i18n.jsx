import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const translations = {
  'Dashboard': 'डैशबोर्ड',
  'Scan Issue': 'समस्या स्कैन करें',
  'Civic Map': 'नागरिक मानचित्र',
  'Civic Feed': 'नागरिक फ़ीड',
  'Leaderboard': 'लीडरबोर्ड',
  'Profile': 'प्रोफ़ाइल',
  'All issues': 'सभी समस्याएँ',
  'My reports': 'मेरी रिपोर्ट',
  'Analytics': 'विश्लेषण',
  'About platform': 'प्लेटफ़ॉर्म के बारे में',
  'Admin control': 'एडमिन नियंत्रण',
  'Area mission': 'क्षेत्र मिशन',
  'Report. Verify. Improve.': 'रिपोर्ट करें। सत्यापित करें। सुधारें।',
  'Civic Command Center': 'नागरिक कमांड सेंटर',
  'Real-time view of your area': 'अपने क्षेत्र का रीयल-टाइम दृश्य',
  'Search reports': 'रिपोर्ट खोजें',
  'Sign out': 'साइन आउट',
  'Scan Civic Issue': 'नागरिक समस्या स्कैन करें',
  'AI-powered issue detection': 'AI आधारित समस्या पहचान',
  'Civic Map': 'नागरिक मानचित्र',
  'Live issue intelligence': 'लाइव समस्या जानकारी',
  'Civic Feed': 'नागरिक फ़ीड',
  'See what citizens are reporting': 'देखें नागरिक क्या रिपोर्ट कर रहे हैं',
  'Nagar Leaderboard': 'नगर लीडरबोर्ड',
  'Every verified report counts': 'हर सत्यापित रिपोर्ट मायने रखती है',
  'Citizen Profile': 'नागरिक प्रोफ़ाइल',
  'Your civic contribution': 'आपका नागरिक योगदान',
  'Issue Operations': 'समस्या संचालन',
  'Search and track civic issues': 'नागरिक समस्याएँ खोजें और ट्रैक करें',
  'My Reports': 'मेरी रिपोर्ट',
  'Track your submitted issues': 'अपनी भेजी गई समस्याएँ ट्रैक करें',
  'Civic Analytics': 'नागरिक विश्लेषण',
  'Operational intelligence from live reports': 'लाइव रिपोर्ट से संचालन जानकारी',
  'About Nagar Drishti': 'नगर दृष्टि के बारे में',
  'Report, understand, act': 'रिपोर्ट करें, समझें, कार्य करें',
  'LIVE': 'लाइव',
  'YOUR AREA. YOUR VOICE.': 'आपका क्षेत्र। आपकी आवाज़।',
  'SPOT IT. REPORT IT.': 'देखें। रिपोर्ट करें।',
  'TOGETHER, WE IMPROVE.': 'मिलकर सुधारें।',
  'WELCOME BACK': 'वापसी पर स्वागत है',
  'Sign in to Nagar Drishti': 'नगर दृष्टि में साइन इन करें',
  'Choose your workspace to continue.': 'जारी रखने के लिए अपना कार्यक्षेत्र चुनें।',
  'Citizen': 'नागरिक',
  'Admin': 'एडमिन',
  'Email address': 'ईमेल पता',
  'Password': 'पासवर्ड',
  'Continue to citizen workspace': 'नागरिक कार्यक्षेत्र पर जाएँ',
  'Continue to admin workspace': 'एडमिन कार्यक्षेत्र पर जाएँ',
  'Citizen access': 'नागरिक प्रवेश',
  'Admin access': 'एडमिन प्रवेश',
  'Use any email and password for this local preview.': 'इस स्थानीय प्रीव्यू के लिए कोई भी ईमेल और पासवर्ड इस्तेमाल करें।',
  'Operations overview': 'संचालन अवलोकन',
  'Latest civic reports': 'नवीनतम नागरिक रिपोर्ट',
  'Department workload': 'विभागीय कार्यभार',
  'Total reports': 'कुल रिपोर्ट',
  'Awaiting action': 'कार्रवाई लंबित',
  'High priority': 'उच्च प्राथमिकता',
  'Resolved': 'समाधान किया गया',
  'Pending': 'लंबित',
  'In progress': 'प्रगति में',
  'All': 'सभी',
  'What needs fixing?': 'क्या ठीक करने की ज़रूरत है?',
  'Analyze with AI': 'AI से विश्लेषण करें',
  'Get GPS': 'GPS प्राप्त करें',
  'Submit verified report': 'सत्यापित रिपोर्ट भेजें',
  'Confirm': 'पुष्टि करें',
  'Wrong tag': 'गलत टैग',
  'Refresh': 'रीफ़्रेश',
  'Layers': 'लेयर्स',
  'Locate me': 'मेरा स्थान',
  'Visible reports': 'दिखाई देने वाली रिपोर्ट',
  'Issue not found': 'समस्या नहीं मिली',
  'Back to issues': 'समस्याओं पर वापस जाएँ',
}

const LanguageContext = createContext(null)
const originalText = new WeakMap()

function applyTranslations(language) {
  if (typeof document === 'undefined') return
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let node
  while ((node = walker.nextNode())) {
    if (!node.parentElement || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.parentElement.tagName)) continue
    if (!originalText.has(node)) originalText.set(node, node.nodeValue)
    const source = originalText.get(node)
    const trimmed = source.trim()
    const translated = language === 'hi' ? translations[trimmed] : trimmed
    if (!translated) continue
    node.nodeValue = source.replace(trimmed, translated)
  }

  document.querySelectorAll('input[placeholder], [aria-label], [title]').forEach(element => {
    for (const attribute of ['placeholder', 'aria-label', 'title']) {
      const source = element.getAttribute(attribute)
      if (!source) continue
      const translated = language === 'hi' ? translations[source] : null
      if (translated) element.setAttribute(attribute, translated)
      else if (language === 'en' && translations[source]) element.setAttribute(attribute, source)
    }
  })
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('nagar_drishti_language') || 'en')
  const value = useMemo(() => ({
    language,
    isHindi: language === 'hi',
    toggleLanguage: () => setLanguage(current => current === 'en' ? 'hi' : 'en'),
  }), [language])

  useEffect(() => {
    localStorage.setItem('nagar_drishti_language', language)
    applyTranslations(language)
    const observer = new MutationObserver(() => applyTranslations(language))
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}
