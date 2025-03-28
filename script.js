// script.js - הקובץ הראשי של JavaScript לאתר "לומדים עברית"

/**
 * פונקציה לפתיחת לשונית
 * @param {string} tabName - שם הלשונית שיש לפתוח (alphabet, words, sentences, exercises)
 */
function openTab(tabName) {
    // מסתיר את כל התוכן
    var tabContents = document.getElementsByClassName('tab-content');
    for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    // מסיר את המחלקה 'active' מכל הלשוניות
    var tabs = document.getElementsByClassName('tab');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    
    // מציג את התוכן הנבחר
    document.getElementById(tabName).classList.add('active');
    
    // מוצא את הלשונית המתאימה ומוסיף לה את המחלקה 'active'
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].textContent === getTabName(tabName)) {
            tabs[i].classList.add('active');
        }
    }
    
    // רושם לקונסול לצורך דיבוג
    console.log(`הלשונית '${tabName}' נפתחה`);
}

/**
 * פונקציה לקבלת שם הלשונית בעברית
 * @param {string} tabId - מזהה הלשונית
 * @return {string} - שם הלשונית בעברית
 */
function getTabName(tabId) {
    switch(tabId) {
        case 'alphabet': return 'אותיות';
        case 'words': return 'מילים';
        case 'sentences': return 'משפטים';
        case 'exercises': return 'תרגול';
        default: return '';
    }
}

/**
 * פונקציה להשמעת צליל
 * המבנה הנכון של התיקיות הוא:
 * - אותיות: media/sounds/letters/
 * - מילים: media/sounds/word/ (לא words!)
 * - משפטים: media/sounds/sentences/
 * 
 * @param {string} soundId - מזהה הצליל (שם הקובץ ללא סיומת)
 * @param {string} folderName - שם התיקייה (letters, words, sentences)
 */
function playSound(soundId, folderName) {
    console.log(`מנסה להשמיע קובץ: ${soundId} מתיקייה: ${folderName}`);
    
    // נתיב מעודכן שמתאים למבנה התיקיות הנכון
    let audioPath;
    
    // בניית הנתיב לפי התיקייה - שים לב לשינוי מ- words ל- word
    if (folderName === 'letters') {
        audioPath = `media/sounds/letters/${soundId}.mp3`;
    } else if (folderName === 'words') {
        // שים לב שהתיקייה היא 'word' (יחיד) ולא 'words'
        audioPath = `media/sounds/word/${soundId}.mp3`;
    } else if (folderName === 'sentences') {
        audioPath = `media/sounds/sentences/${soundId}.mp3`;
    } else {
        audioPath = `media/sounds/${soundId}.mp3`;
    }
    
    console.log(`נתיב קובץ השמע: ${audioPath}`);
    
    try {
        var audio = new Audio(audioPath);
        
        // הדגשת הכרטיס שנלחץ
        var card = document.querySelector(`[onclick="playSound('${soundId}', '${folderName}')"]`);
        if (card) {
            // שומר על הצבע המקורי
            const originalColor = card.style.backgroundColor || "white";
            // משנה את הצבע זמנית כדי להדגיש את הכרטיס
            card.style.backgroundColor = "#f0f0ff";
            setTimeout(function() {
                card.style.backgroundColor = originalColor;
            }, 300);
        }
        
        // טיפול בשגיאות טעינה
        audio.onerror = function(e) {
            console.error(`שגיאה בטעינת קובץ השמע: ${audioPath}`, e);
            console.error(`קוד השגיאה: ${audio.error ? audio.error.code : 'לא ידוע'}`);
            // מעבר לגיבוי - Speech API
            useSpeechAPI(soundId);
        };
        
        // ניגון הקובץ
        audio.play().catch(function(error) {
            console.error(`שגיאה בהשמעת קובץ השמע: ${audioPath}`, error);
            // מעבר לגיבוי - Speech API
            useSpeechAPI(soundId);
        });
    } catch(e) {
        console.error(`שגיאה כללית בהשמעת השמע:`, e);
        // מעבר לגיבוי - Speech API
        useSpeechAPI(soundId);
    }
}

/**
 * פונקציה להקראה באמצעות Web Speech API כגיבוי
 * פונקציה זו משמשת במקרה שקבצי השמע לא זמינים
 * 
 * @param {string} soundId - מזהה הצליל
 */
function useSpeechAPI(soundId) {
    console.log(`משתמש ב-Speech API עבור: ${soundId}`);
    
    // מיפוי זיהוי לטקסט שיוקרא
    const textMap = {
        // אותיות
        'alef': 'אלף',
        'bet': 'בית',
        'gimel': 'גימל',
        'dalet': 'דלת',
        'hey': 'הא',
        'vav': 'וו',
        'zayin': 'זין',
        'het': 'חית',
        'tet': 'טית',
        'yod': 'יוד',
        'kaf': 'כף',
        'lamed': 'למד',
        'mem': 'מם',
        'nun': 'נון',
        'samekh': 'סמך',
        'ayin': 'עין',
        'pe': 'פה',
        'tsadi': 'צדי',
        'qof': 'קוף',
        'resh': 'ריש',
        'shin': 'שין',
        'tav': 'תו',
        // מילים
        'cat': 'חתול',
        'dog': 'כלב',
        'house': 'בית',
        'tree': 'עץ',
        'flower': 'פרח',
        'boy': 'ילד',
        'girl': 'ילדה',
        'sun': 'שמש',
        'water': 'מים',
        'book': 'ספר',
        // משפטים
        'hello': 'שלום',
        'how-are-you': 'מה שלומך',
        'thanks': 'תודה',
        'cat-eats-fish': 'החתול אוכל דג',
        'boy-reads-book': 'הילד קורא ספר'
    };
    
    if ('speechSynthesis' in window) {
        const textToSpeak = textMap[soundId] || soundId;
        
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'he-IL';  // עברית
        utterance.rate = 0.9;      // מהירות דיבור מעט איטית יותר לבהירות
        utterance.volume = 1.0;    // עוצמת קול מקסימלית
        
        window.speechSynthesis.speak(utterance);
    } else {
        console.error("הדפדפן שלך אינו תומך בהקראה");
        alert("הדפדפן אינו תומך בשירות ההקראה. אנא השתמש בדפדפן עדכני יותר.");
    }
}

/**
 * פונקציה שמופעלת כאשר המסמך נטען
 * מוסיף מאזיני אירועים ומבצע אתחול ראשוני
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('המסמך נטען, מתחיל אתחול...');
    
    // פתיחת הלשונית הראשונה כברירת מחדל
    // קיים כבר בקוד HTML דרך מחלקת 'active'
    
    // מוסיף בדיקת זמינות של קבצי שמע
    checkAudioAvailability();
});

/**
 * פונקציה לבדיקת זמינות קבצי שמע
 * מבצעת בדיקה מדגמית של קובץ אחד מכל קטגוריה
 */
function checkAudioAvailability() {
    console.log('בודק זמינות קבצי שמע...');
    
    // בדיקת קובץ שמע לדוגמה מכל קטגוריה
    const testFiles = {
        letters: 'alef',
        words: 'cat',
        sentences: 'hello'
    };
    
    // עבור כל קטגוריה, בודק אם קובץ לדוגמה קיים
    for (const folder in testFiles) {
        const soundId = testFiles[folder];
        let path;
        
        // בניית הנתיב הנכון לפי הקטגוריה
        if (folder === 'letters') {
            path = `media/sounds/letters/${soundId}.mp3`;
        } else if (folder === 'words') {
            // שים לב לשימוש ב-'word' במקום 'words'
            path = `media/sounds/word/${soundId}.mp3`;
        } else if (folder === 'sentences') {
            path = `media/sounds/sentences/${soundId}.mp3`;
        }
        
        // בדיקה אם הקובץ קיים
        const audio = new Audio(path);
        audio.onerror = function() {
            console.warn(`קובץ השמע ${path} לא נמצא. יש לוודא שכל קבצי השמע קיימים במיקום הנכון.`);
        };
        
        console.log(`בדיקת זמינות: ${path}`);
    }
}
