// פונקציה להשמעת קול - תמיכה היברידית בקבצי אודיו ו-Speech API
function playSound(soundId) {
    // הדגשת הכרטיס 
    const cardElement = document.querySelector(`[onclick="playSound('${soundId}')"]`);
    if (cardElement) {
        cardElement.classList.add('active-sound');
        setTimeout(() => {
            cardElement.classList.remove('active-sound');
        }, 1000);
    }
    
    // מיפוי זיהוי לקבצי שמע ולטקסט להקראה
    const soundMap = {
        // אותיות
        'alef': { file: 'sounds/alef.mp3', text: 'אָלֶף' },
        'bet': { file: 'sounds/bet.mp3', text: 'בֵּית' },
        'gimel': { file: 'sounds/gimel.mp3', text: 'גִימֶל' },
        'dalet': { file: 'sounds/dalet.mp3', text: 'דָּלֶת' },
        'hey': { file: 'sounds/hey.mp3', text: 'הֵא' },
        'vav': { file: 'sounds/vav.mp3', text: 'וָו' },
        'zayin': { file: 'sounds/zayin.mp3', text: 'זַיִן' },
        'het': { file: 'sounds/chet.mp3', text: 'חֵית' },
        'tet': { file: 'sounds/tet.mp3', text: 'טֵית' },
        'yod': { file: 'sounds/yod.mp3', text: 'יוֹד' },
        'kaf': { file: 'sounds/kaf.mp3', text: 'כַּף' },
        'lamed': { file: 'sounds/lamed.mp3', text: 'לָמֶד' },
        'mem': { file: 'sounds/mem.mp3', text: 'מֵם' },
        'nun': { file: 'sounds/nun.mp3', text: 'נוּן' },
        'samekh': { file: 'sounds/samech.mp3', text: 'סָמֶךְ' },
        'ayin': { file: 'sounds/ayin.mp3', text: 'עַיִן' },
        'pe': { file: 'sounds/pey.mp3', text: 'פֵּה' },
        'tsadi': { file: 'sounds/tsadi.mp3', text: 'צָדִי' },
        'qof': { file: 'sounds/kuf.mp3', text: 'קוֹף' },
        'resh': { file: 'sounds/resh.mp3', text: 'רֵישׁ' },
        'shin': { file: 'sounds/shin.mp3', text: 'שִׁין' },
        'tav': { file: 'sounds/tav.mp3', text: 'תָּו' },
        
        // מילים
        'word-cat': { file: 'sounds/cat.mp3', text: 'חתול' },
        'word-dog': { file: 'sounds/dog.mp3', text: 'כלב' },
        'word-house': { file: 'sounds/house.mp3', text: 'בית' },
        'word-tree': { file: 'sounds/tree.mp3', text: 'עץ' },
        'word-flower': { file: 'sounds/flower.mp3', text: 'פרח' },
        'word-boy': { file: 'sounds/boy.mp3', text: 'ילד' },
        'word-girl': { file: 'sounds/girl.mp3', text: 'ילדה' },
        'word-sun': { file: 'sounds/sun.mp3', text: 'שמש' },
        'word-water': { file: 'sounds/water.mp3', text: 'מים' },
        'word-book': { file: 'sounds/book.mp3', text: 'ספר' },
        
        // משפטים
        'sentence-cat-eats-fish': { file: 'sounds/cat-eats-fish.mp3', text: 'החתול אוכל דג' },
        'sentence-boy-reads-book': { file: 'sounds/boy-reads-book.mp3', text: 'הילד קורא ספר' },
        'sentence-girl-drinks-water': { file: 'sounds/girl-drinks-water.mp3', text: 'הילדה שותה מים' },
        'sentence-dog-runs-garden': { file: 'sounds/dog-runs-garden.mp3', text: 'הכלב רץ בגינה' },
        'sentence-sun-shines-sky': { file: 'sounds/sun-shines-sky.mp3', text: 'השמש זורחת בשמיים' }
    };
    
    // בדיקה אם יש מידע על הצליל שביקשנו
    const soundInfo = soundMap[soundId];
    if (!soundInfo) {
        console.error(`לא נמצא מידע עבור הצליל: ${soundId}`);
        return;
    }
    
    // ניסיון לנגן את קובץ השמע
    const audio = new Audio(soundInfo.file);
    
    // אם יש שגיאה בטעינת הקובץ, השתמש ב-Speech API כגיבוי
    audio.onerror = function() {
        console.log(`קובץ השמע ${soundInfo.file} לא נמצא. משתמש ב-Speech API כגיבוי.`);
        useSpeechAPI(soundInfo.text);
    };
    
    // ניסיון לנגן את הקובץ
    audio.play().catch(error => {
        console.log(`שגיאה בניגון קובץ השמע: ${error.message}. משתמש ב-Speech API כגיבוי.`);
        useSpeechAPI(soundInfo.text);
    });
}

// פונקציה להשמעת טקסט באמצעות Web Speech API
function useSpeechAPI(textToSpeak) {
    // אם Web Speech API לא זמין
    if (!('speechSynthesis' in window)) {
        console.error("הדפדפן שלך אינו תומך בהקראה.");
        return;
    }
    
    try {
        // יצירת אובייקט הקראה חדש
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        
        // הגדרת שפה לעברית
        utterance.lang = 'he-IL';
        
        // בדיקה אם קיימים קולות בעברית
        const voices = window.speechSynthesis.getVoices();
        const hebrewVoice = voices.find(voice => voice.lang.includes('he') || voice.lang.includes('iw'));
        
        // אם נמצא קול עברי, השתמש בו
        if (hebrewVoice) {
            utterance.voice = hebrewVoice;
        }
        
        // הגדרת מהירות ועוצמה
        utterance.rate = 0.9; // קצת יותר איטי מהרגיל
        utterance.volume = 1.0; // עוצמת קול מרבית
        
        // טיפול במצב שבו הקולות לא נטענו עדיין
        if (voices.length === 0) {
            window.speechSynthesis.onvoiceschanged = function() {
                const updatedVoices = window.speechSynthesis.getVoices();
                const updatedHebrewVoice = updatedVoices.find(voice => voice.lang.includes('he') || voice.lang.includes('iw'));
                if (updatedHebrewVoice) {
                    utterance.voice = updatedHebrewVoice;
                }
                window.speechSynthesis.speak(utterance);
            };
        } else {
            // הפעלת ההקראה
            window.speechSynthesis.speak(utterance);
        }
        
        console.log('הקראה של:', textToSpeak);
    } catch (error) {
        console.error('שגיאה בהקראה:', error);
    }
}

// פונקציה לפתיחת תרגיל ספציפי
function openExercise(exerciseId) {
    alert(`התרגיל "${exerciseId}" בבנייה. יהיה זמין בקרוב!`);
}

// פונקציה לניווט בין הלשוניות
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
        if (tabs[i].getAttribute('data-tab') === tabName) {
            tabs[i].classList.add('active');
        }
    }
}

// טעינת לשונית ברירת המחדל כאשר הדף נטען
document.addEventListener('DOMContentLoaded', function() {
    // טעינת לשונית האותיות כברירת מחדל
    if (document.querySelector('.tab.active')) {
        const activeTabName = document.querySelector('.tab.active').getAttribute('data-tab');
        if (activeTabName) {
            openTab(activeTabName);
        } else {
            openTab('alphabet');
        }
    } else {
        openTab('alphabet');
    }
});
