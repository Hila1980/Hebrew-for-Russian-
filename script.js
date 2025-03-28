// פונקציה לפתיחת לשונית
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
}

// פונקציה לקבלת שם הלשונית
function getTabName(tabId) {
    switch(tabId) {
        case 'alphabet': return 'אותיות';
        case 'words': return 'מילים';
        case 'sentences': return 'משפטים';
        case 'exercises': return 'תרגול';
        default: return '';
    }
}

// פונקציה להשמעת צליל
function playSound(soundId, folderName) {
    console.log(`מנסה להשמיע קובץ: ${soundId} מתיקייה: ${folderName}`);
    
    // נתיב חדש שמתאים למבנה התיקיות החדש
    let audioPath;
    
    // בניית הנתיב לפי התיקייה
    if (folderName === 'letters') {
        audioPath = `media/sounds/letters/${soundId}.mp3`;
    } else if (folderName === 'words') {
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
            card.style.backgroundColor = "#f0f0ff";
            setTimeout(function() {
                card.style.backgroundColor = "white";
            }, 300);
        }
        
        // טיפול בשגיאות טעינה
        audio.onerror = function(e) {
            console.error(`שגיאה בטעינת קובץ השמע: ${audioPath}`, e);
            useSpeechAPI(soundId);
        };
        
        // ניגון הקובץ
        audio.play().catch(function(error) {
            console.error(`שגיאה בהשמעת קובץ השמע: ${audioPath}`, error);
            useSpeechAPI(soundId);
        });
    } catch(e) {
        console.error(`שגיאה כללית בהשמעת השמע:`, e);
        useSpeechAPI(soundId);
    }
}

// פונקציה להקראה באמצעות Web Speech API כגיבוי
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
        utterance.lang = 'he-IL';
        utterance.rate = 0.9;
        utterance.volume = 1.0;
        
        window.speechSynthesis.speak(utterance);
    } else {
        console.error("הדפדפן שלך אינו תומך בהקראה");
    }
}
