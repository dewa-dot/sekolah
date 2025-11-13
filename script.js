document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // SPA-like functionality for posts
    const postsContainer = document.getElementById('posts-container');
    const mainView = document.getElementById('main-view');
    const postDetailView = document.getElementById('post-detail-view');
    const backToPostsBtn = document.getElementById('back-to-posts');
    
    let allPosts = []; // Store posts data here

    function showPostDetail(postId) {
        const post = allPosts.find(p => p.id == postId);
        if (!post) return;

        document.getElementById('post-detail-image').src = post.imageUrl;
        document.getElementById('post-detail-image').alt = post.title;
        document.getElementById('post-detail-title').textContent = post.title;
        document.getElementById('post-detail-date').textContent = post.date;
        document.getElementById('post-detail-content').innerHTML = post.content.replace(/\n/g, '<br>');

        mainView.classList.add('hidden');
        postDetailView.classList.remove('hidden');
        window.scrollTo(0, 0); // Scroll to top
    }

    function showMainView() {
        postDetailView.classList.add('hidden');
        mainView.classList.remove('hidden');
    }

    if (postsContainer) {
        fetch('posts.json')
            .then(response => response.json())
            .then(posts => {
                allPosts = posts;
                postsContainer.innerHTML = ''; // Clear existing content
                if (posts.length === 0) {
                     postsContainer.innerHTML = '<p>Tidak ada postingan saat ini.</p>';
                     return;
                }
                posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.className = 'bg-white rounded-lg shadow-md overflow-hidden';
                    const shortContent = post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content;
                    postElement.innerHTML = `
                        <img src="${post.imageUrl}" alt="${post.title}" class="w-full h-48 object-cover">
                        <div class="p-6">
                            <h3 class="text-xl font-bold mb-2">${post.title}</h3>
                            <p class="text-gray-600 text-sm mb-4">${post.date}</p>
                            <p class="text-gray-700">${shortContent}</p>
                            <a href="#" data-post-id="${post.id}" class="read-more-link text-blue-500 hover:underline mt-4 inline-block">Baca Selengkapnya</a>
                        </div>
                    `;
                    postsContainer.appendChild(postElement);
                });
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                postsContainer.innerHTML = '<p>Gagal memuat postingan.</p>';
            });

        // Event listener for "Read More" links using event delegation
        postsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('read-more-link')) {
                e.preventDefault();
                const postId = e.target.getAttribute('data-post-id');
                showPostDetail(postId);
            }
        });
    }

    // Event listener for the back button
    if (backToPostsBtn) {
        backToPostsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showMainView();
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if(!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });
});