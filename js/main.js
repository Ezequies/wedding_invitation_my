document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. COUNTDOWN TIMER
    // ==========================================================================
    // Date: October 10, 2027 16:00:00 (16:00 hs)
    const targetDate = new Date('October 10, 2027 16:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            // Event has started or passed
            document.getElementById('days').innerText = '00';
            document.getElementById('hours').innerText = '00';
            document.getElementById('minutes').innerText = '00';
            document.getElementById('seconds').innerText = '00';
            clearInterval(countdownInterval);
            return;
        }

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Format numbers to always display 2 digits
        document.getElementById('days').innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
    }

    // Run countdown initially and then every second
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);


    // ==========================================================================
    // 2. SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Offset triggers slightly
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    // ==========================================================================
    // 3. BACKGROUND MUSIC CONTROLLER (AUDIO)
    // ==========================================================================
    const audioControl = document.getElementById('audioControl');
    const bgMusic = document.getElementById('bgMusic');
    const audioBtn = document.getElementById('audioBtn');
    const audioIcon = document.getElementById('audioIcon');
    const audioText = document.querySelector('.audio-text');

    let isPlaying = false;

    // Toggle Music Play/Pause
    audioControl.addEventListener('click', toggleAudio);

    function toggleAudio() {
        if (isPlaying) {
            bgMusic.pause();
            audioIcon.className = 'fas fa-play';
            audioControl.classList.remove('playing');
            audioText.innerText = 'Escuchar música';
            isPlaying = false;
        } else {
            // Attempt to play
            bgMusic.play().then(() => {
                audioIcon.className = 'fas fa-pause';
                audioControl.classList.add('playing');
                audioText.innerText = 'Pausar música';
                isPlaying = true;
            }).catch(error => {
                console.log("Error al reproducir audio: ", error);
                alert("Por favor interactúa con la página para poder reproducir la música.");
            });
        }
    }


    // ==========================================================================
    // 4. COPY BANK DETAILS TO CLIPBOARD
    // ==========================================================================
    const copyAliasBtn = document.getElementById('copyAliasBtn');
    const aliasText = document.getElementById('aliasText').innerText;
    const copyIcon = document.getElementById('copyIcon');
    const copyBtnText = document.getElementById('copyBtnText');

    copyAliasBtn.addEventListener('click', () => {
        // Use clipboard API
        navigator.clipboard.writeText(aliasText).then(() => {
            // Visual success feedback
            copyAliasBtn.classList.add('copied');
            copyIcon.className = 'fas fa-circle-check';
            copyBtnText.innerText = '¡Alias Copiado!';

            // Reset button after 2.5 seconds
            setTimeout(() => {
                copyAliasBtn.classList.remove('copied');
                copyIcon.className = 'far fa-copy';
                copyBtnText.innerText = 'Copiar Alias';
            }, 2500);
        }).catch(err => {
            console.error('Error al copiar texto: ', err);
            // Fallback for older devices / insecure contexts
            const textarea = document.createElement('textarea');
            textarea.value = aliasText;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                copyAliasBtn.classList.add('copied');
                copyIcon.className = 'fas fa-circle-check';
                copyBtnText.innerText = '¡Alias Copiado!';
                setTimeout(() => {
                    copyAliasBtn.classList.remove('copied');
                    copyIcon.className = 'far fa-copy';
                    copyBtnText.innerText = 'Copiar Alias';
                }, 2500);
            } catch (errFallback) {
                alert('No se pudo copiar el alias automáticamente. Puedes copiarlo manualmente: ' + aliasText);
            }
            document.body.removeChild(textarea);
        });
    });


    // ==========================================================================
    // 5. RSVP FORM INTERACTIVITY AND WHATSAPP REDIRECT
    // ==========================================================================
    const rsvpForm = document.getElementById('rsvpForm');
    const menuSelection = document.getElementById('menuSelection');
    const menuDetailsGroup = document.getElementById('menuDetailsGroup');
    const menuDetailsInput = document.getElementById('menuDetails');
    const rsvpSuccess = document.getElementById('rsvpSuccess');
    const manualWaLink = document.getElementById('manualWaLink');
    const attendanceRadios = document.getElementsByName('attendance');
    const menuGroup = document.getElementById('menuGroup');

    // Toggle menu details field if "Otro" is selected
    menuSelection.addEventListener('change', () => {
        if (menuSelection.value === 'otro') {
            menuDetailsGroup.classList.remove('hidden');
            menuDetailsInput.setAttribute('required', 'required');
        } else {
            menuDetailsGroup.classList.add('hidden');
            menuDetailsInput.removeAttribute('required');
        }
    });

    // Hide/Show menu options based on attendance (only show if attending)
    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'si') {
                menuGroup.classList.remove('hidden');
                // restore 'otro' field state if selected
                if (menuSelection.value === 'otro') {
                    menuDetailsGroup.classList.remove('hidden');
                }
            } else {
                menuGroup.classList.add('hidden');
                menuDetailsGroup.classList.add('hidden');
            }
        });
    });

    // Handle Form Submit and WhatsApp compilation
    rsvpForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // 1. Gather values
        const fullName = document.getElementById('fullName').value.trim();
        const attendance = document.querySelector('input[name="attendance"]:checked').value;
        const playlistSong = document.getElementById('playlistSong').value.trim();
        const additionalNotes = document.getElementById('additionalNotes').value.trim();
        
        let attendanceText = "";
        let menuText = "";
        
        if (attendance === 'si') {
            attendanceText = "¡Sí, confirmo asistencia! 🎉🤵👰";
            
            // Menu restrictions details
            const menuVal = menuSelection.value;
            const menuLabel = menuSelection.options[menuSelection.selectedIndex].text;
            if (menuVal === 'otro') {
                menuText = `Menú Especial: ${menuDetailsInput.value.trim()}`;
            } else {
                menuText = menuLabel;
            }
        } else {
            attendanceText = "Lamentablemente no podré asistir 😔";
        }

        // 2. Construct WhatsApp Message text
        let message = `¡Hola Fiamma y Ezequiel!\n`;
        message += `Confirmo los datos de asistencia a su casamiento:\n\n`;
        message += `*Nombre:* ${fullName}\n`;
        message += `*Asistencia:* ${attendanceText}\n`;

        if (attendance === 'si') {
            message += `*Menú:* ${menuText}\n`;
            if (playlistSong) {
                message += `*Canción sugerida:* ${playlistSong}\n`;
            }
        }
        
        if (additionalNotes) {
            message += `*Mensaje:* ${additionalNotes}\n`;
        }

        // 3. Target phone number
        // Argentinian code format: 549 + area code (351) + local phone (3333333) = 5493513333333
        const phoneNumber = "5493513333333";
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

        // 4. Update UI to Success State
        rsvpForm.classList.add('hidden');
        rsvpSuccess.classList.remove('hidden');
        manualWaLink.setAttribute('href', whatsappUrl);

        // 5. Open WhatsApp redirect
        window.open(whatsappUrl, '_blank');
    });

    // ==========================================================================
    // 6. GUEST QUERY PARAMETER PARSING
    // ==========================================================================
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('invitado') || urlParams.get('name') || urlParams.get('guest');

    if (guestParam) {
        const guestName = guestParam.trim();
        const guestBadge = document.getElementById('guestBadge');
        const guestNameSpan = document.getElementById('guestName');
        const fullNameInput = document.getElementById('fullName');

        if (guestNameSpan && guestBadge) {
            guestNameSpan.innerText = guestName;
            guestBadge.classList.remove('hidden');
        }

        if (fullNameInput) {
            fullNameInput.value = guestName;
        }
    }
});
