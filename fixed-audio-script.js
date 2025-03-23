// פונקציה להשמעת קול - עם טיפול בשגיאות משופר
function playSound(soundId) {
    console.log(`מנסה להשמיע: ${soundId}`);
    
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
    
    // בדיקה אם זמין API של שמע
    try {
        // ניסיון להשמיע באמצעות Audio API
        const audioUrl = soundInfo.file;
        console.log(`מנסה לנגן קובץ שמע: ${audioUrl}`);
        
        // יצירת אלמנט אודיו
        const audio = new Audio(audioUrl);
        
        // הוספת טיפול באירועים לדיבאג
        audio.onloadeddata = function() {
            console.log(`הקובץ ${audioUrl} נטען בהצלחה`);
        };
        
        audio.oncanplay = function() {
            console.log(`הקובץ ${audioUrl} מוכן לניגון`);
        };
        
        // אם יש שגיאה בטעינת הקובץ, השתמש ב-Speech API כגיבוי
        audio.onerror = function(e) {
            console.error(`שגיאה בטעינת הקובץ ${audioUrl}:`, e);
            useSpeechAPI(soundInfo.text);
        };
        
        // ניסיון לנגן את הקובץ
        const playPromise = audio.play();
        
        // טיפול בהבטחה שחוזרת מ-play()
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log(`מנגן קובץ שמע: ${audioUrl}`);
                })
                .catch(error => {
                    console.error(`שגיאה בניגון: ${error.message}`);
                    console.log(`מנסה להשתמש ב-Speech API כגיבוי...`);
                    useSpeechAPI(soundInfo.text);
                });
        }
    } catch (error) {
        console.error('שגיאה כללית בהשמעת השמע:', error);
        useSpeechAPI(soundInfo.text);
    }
}

// פונקציה להשמעת טקסט באמצעות Web Speech API
function useSpeechAPI(textToSpeak) {
    console.log(`מנסה להשתמש ב-Web Speech API להקראת: ${textToSpeak}`);
    
    // אם Web Speech API לא זמין
    if (!('speechSynthesis' in window)) {
        console.error("הדפדפן שלך אינו תומך בהקראה.");
        alert("הדפדפן שלך אינו תומך בהקראה.");
        return;
    }
    
    try {
        // יצירת אובייקט הקראה חדש
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        
        // הגדרת שפה לעברית
        utterance.lang = 'he-IL';
        
        // הגדרת עוצמה ומהירות
        utterance.volume = 1.0;
        utterance.rate = 0.9;
        
        // הוספת טיפול באירועים לדיבאג
        utterance.onstart = function() {
            console.log(`התחלת הקראה: ${textToSpeak}`);
        };
        
        utterance.onend = function() {
            console.log(`סיום הקראה: ${textToSpeak}`);
        };
        
        utterance.onerror = function(event) {
            console.error(`שגיאה בהקראה: ${event.error}`);
        };
        
        // בדיקה אם קיימים קולות בעברית וטעינה מחדש אם צריך
        if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.onvoiceschanged = function() {
                const voices = window.speechSynthesis.getVoices();
                console.log(`נטענו ${voices.length} קולות`);
                
                // חיפוש קול עברי
                const hebrewVoice = voices.find(voice => voice.lang.includes('he') || voice.lang.includes('iw'));
                if (hebrewVoice) {
                    console.log(`נמצא קול עברי: ${hebrewVoice.name}`);
                    utterance.voice = hebrewVoice;
                }
                
                // הפעלת ההקראה
                window.speechSynthesis.speak(utterance);
            };
        } else {
            // חיפוש קול עברי
            const voices = window.speechSynthesis.getVoices();
            const hebrewVoice = voices.find(voice => voice.lang.includes('he') || voice.lang.includes('iw'));
            if (hebrewVoice) {
                console.log(`נמצא קול עברי: ${hebrewVoice.name}`);
                utterance.voice = hebrewVoice;
            }
            
            // הפעלת ההקראה
            window.speechSynthesis.speak(utterance);
        }
    } catch (error) {
        console.error('שגיאה בהקראה:', error);
        alert(`שגיאה בהקראה: ${error.message}`);
    }
}

// פונקציה לפתיחת תרגיל ספציפי
function openExercise(exerciseId) {
    console.log(`מנסה לפתוח תרגיל: ${exerciseId}`);
    
    // כאן נממש את הפתיחה של התרגילים השונים
    switch(exerciseId) {
        case 'match-letters':
            // חיבור התאמת אותיות
            alert('תרגיל התאמת אותיות בבנייה. יהיה זמין בקרוב!');
            break;
        case 'word-game':
            // משחק מילים
            alert('משחק המילים בבנייה. יהיה זמין בקרוב!');
            break;
        case 'sentences-order':
            // סידור משפטים
            alert('תרגיל סידור משפטים בבנייה. יהיה זמין בקרוב!');
            break;
        case 'translation-quiz':
            // חידון תרגום
            alert('חידון התרגום בבנייה. יהיה זמין בקרוב!');
            break;
        default:
            alert(`התרגיל "${exerciseId}" בבנייה. יהיה זמין בקרוב!`);
    }
}

// פונקציה לניווט בין הלשוניות
function openTab(tabName) {
    console.log(`פותח לשונית: ${tabName}`);
    
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
    var selectedContent = document.getElementById(tabName);
    if (selectedContent) {
        selectedContent.classList.add('active');
    } else {
        console.error(`לא נמצא תוכן עבור לשונית: ${tabName}`);
    }
    
    // מוצא את הלשונית המתאימה ומוסיף לה את המחלקה 'active'
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].getAttribute('data-tab') === tabName) {
            tabs[i].classList.add('active');
        }
    }
}

// טעינת לשונית ברירת המחדל כאשר הדף נטען
document.addEventListener('DOMContentLoaded', function() {
    console.log('הדף נטען');
    
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