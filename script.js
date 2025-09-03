document.addEventListener('DOMContentLoaded', function() {
    const editMode = document.getElementById('edit-mode');
    const viewMode = document.getElementById('view-mode');
    const form = document.getElementById('love-form');
    
    // Verificar se já existe dados salvos
    checkSavedData();
    
    // Event listener para o formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveData();
    });
    
    function checkSavedData() {
        const savedData = localStorage.getItem('lovePageData');
        if (savedData) {
            const data = JSON.parse(savedData);
            displayData(data);
            showViewMode();
        } else {
            showEditMode();
        }
    }
    
    function saveData() {
        const data = {
            message: document.getElementById('message').value,
            photoUrl: document.getElementById('photo-url').value,
            videoUrl: document.getElementById('video-url').value,
            startDate: document.getElementById('start-date').value,
            musicUrl: document.getElementById('music-url').value,
            partner1Name: document.getElementById('partner1-name').value,
            partner2Name: document.getElementById('partner2-name').value
        };
        
        // Validação básica
        if (!data.message || !data.partner1Name || !data.partner2Name || !data.startDate) {
            alert('Por favor, preencha pelo menos a mensagem, os nomes e a data de início do relacionamento.');
            return;
        }
        
        // Salvar no localStorage
        localStorage.setItem('lovePageData', JSON.stringify(data));
        
        // Exibir os dados
        displayData(data);
        showViewMode();
    }
    
    function displayData(data) {
        // Exibir nomes
        document.getElementById('display-partner1').textContent = data.partner1Name;
        document.getElementById('display-partner2').textContent = data.partner2Name;
        
        // Exibir mensagem
        document.getElementById('display-message').textContent = data.message;
        
        // Exibir foto
        if (data.photoUrl) {
            const photoImg = document.getElementById('display-photo');
            photoImg.src = data.photoUrl;
            photoImg.style.display = 'block';
        } else {
            document.querySelector('.photo-section').style.display = 'none';
        }
        
        // Exibir vídeo
        if (data.videoUrl) {
            const videoIframe = document.getElementById('display-video');
            const embedUrl = convertToEmbedUrl(data.videoUrl);
            if (embedUrl) {
                videoIframe.src = embedUrl;
            } else {
                document.querySelector('.video-section').style.display = 'none';
            }
        } else {
            document.querySelector('.video-section').style.display = 'none';
        }
        
        // Exibir música
        if (data.musicUrl) {
            const musicIframe = document.getElementById('display-music');
            const embedMusicUrl = convertToMusicEmbedUrl(data.musicUrl);
            if (embedMusicUrl) {
                musicIframe.src = embedMusicUrl;
            } else {
                document.querySelector('.music-section').style.display = 'none';
            }
        } else {
            document.querySelector('.music-section').style.display = 'none';
        }
        
        // Iniciar contador
        if (data.startDate) {
            startCounter(data.startDate);
        }
    }
    
    function convertToEmbedUrl(url) {
        // YouTube
        if (url.includes('youtube.com/watch?v=')) {
            const videoId = url.split('v=')[1].split('&')[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        if (url.includes('youtu.be/')) {
            const videoId = url.split('youtu.be/')[1].split('?')[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        
        // Vimeo
        if (url.includes('vimeo.com/')) {
            const videoId = url.split('vimeo.com/')[1].split('?')[0];
            return `https://player.vimeo.com/video/${videoId}`;
        }
        
        return null;
    }
    
    function convertToMusicEmbedUrl(url) {
        // Spotify
        if (url.includes('open.spotify.com/track/')) {
            const trackId = url.split('track/')[1].split('?')[0];
            return `https://open.spotify.com/embed/track/${trackId}`;
        }
        
        // SoundCloud (mais complexo, mas tentativa básica)
        if (url.includes('soundcloud.com/')) {
            return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`;
        }
        
        return null;
    }
    
    function startCounter(startDate) {
        const start = new Date(startDate);
        
        function updateCounter() {
            const now = new Date();
            const diff = now - start;
            
            const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
            const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
            const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
            
            document.getElementById('years').textContent = years;
            document.getElementById('months').textContent = months;
            document.getElementById('days').textContent = days;
        }
        
        updateCounter();
        setInterval(updateCounter, 1000 * 60 * 60 * 24); // Atualizar diariamente
    }
    
    function showEditMode() {
        editMode.classList.remove('hidden');
        viewMode.classList.add('hidden');
    }
    
    function showViewMode() {
        editMode.classList.add('hidden');
        viewMode.classList.remove('hidden');
    }
    
    // Função para resetar (apenas para desenvolvimento - pode ser removida)
    window.resetPage = function() {
        if (confirm('Tem certeza que deseja resetar a página? Todos os dados serão perdidos.')) {
            localStorage.removeItem('lovePageData');
            location.reload();
        }
    };
    
    // Adicionar botão de reset discreto (apenas para desenvolvimento)
    if (localStorage.getItem('lovePageData')) {
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset (Dev)';
        resetBtn.style.position = 'fixed';
        resetBtn.style.bottom = '10px';
        resetBtn.style.right = '10px';
        resetBtn.style.padding = '5px 10px';
        resetBtn.style.fontSize = '12px';
        resetBtn.style.backgroundColor = '#ff4444';
        resetBtn.style.color = 'white';
        resetBtn.style.border = 'none';
        resetBtn.style.borderRadius = '5px';
        resetBtn.style.cursor = 'pointer';
        resetBtn.style.zIndex = '9999';
        resetBtn.onclick = window.resetPage;
        document.body.appendChild(resetBtn);
    }
    
    // Adicionar efeitos visuais extras
    addVisualEffects();
    
    function addVisualEffects() {
        // Criar partículas de coração flutuantes
        createFloatingHearts();
        
        // Adicionar efeito de parallax suave
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.love-header');
            if (parallax) {
                const speed = scrolled * 0.5;
                parallax.style.transform = `translateY(${speed}px)`;
            }
        });
    }
    
    function createFloatingHearts() {
        if (document.getElementById('view-mode').classList.contains('hidden')) return;
        
        const heartsContainer = document.createElement('div');
        heartsContainer.style.position = 'fixed';
        heartsContainer.style.top = '0';
        heartsContainer.style.left = '0';
        heartsContainer.style.width = '100%';
        heartsContainer.style.height = '100%';
        heartsContainer.style.pointerEvents = 'none';
        heartsContainer.style.zIndex = '1';
        document.body.appendChild(heartsContainer);
        
        function createHeart() {
            const heart = document.createElement('i');
            heart.className = 'fas fa-heart';
            heart.style.position = 'absolute';
            heart.style.color = '#ff6b9d';
            heart.style.fontSize = Math.random() * 20 + 10 + 'px';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = '100%';
            heart.style.opacity = '0.7';
            heart.style.animation = `floatUp ${Math.random() * 3 + 5}s linear infinite`;
            
            heartsContainer.appendChild(heart);
            
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 8000);
        }
        
        // Criar corações periodicamente
        setInterval(createHeart, 3000);
        
        // Adicionar animação CSS para os corações flutuantes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatUp {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0.7;
                }
                50% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
});

