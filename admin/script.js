document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('post-form');
    const postIdInput = document.getElementById('post-id');
    const postTitleInput = document.getElementById('post-title');
    const postContentInput = document.getElementById('post-content');
    const submitBtn = document.getElementById('submit-btn');
    const postsTableBody = document.getElementById('posts-table-body');

    let posts = [];

    // NOTE: In a real application, you would need a server-side component 
    // to actually save, update, and delete data from the posts.json file.
    // This frontend-only example simulates these actions by manipulating data in memory.
    // The changes will be lost on page reload.

    async function fetchPosts() {
        try {
            const response = await fetch('../posts.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            posts = await response.json();
            renderTable();
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            postsTableBody.innerHTML = '<tr><td colspan="3" class="p-3 text-center text-red-500">Gagal memuat data.</td></tr>';
        }
    }

    function renderTable() {
        postsTableBody.innerHTML = '';
        if (posts.length === 0) {
            postsTableBody.innerHTML = '<tr><td colspan="3" class="p-3 text-center">Belum ada postingan.</td></tr>';
            return;
        }

        posts.forEach(post => {
            const row = document.createElement('tr');
            row.className = 'border-b';
            row.innerHTML = `
                <td class="p-3">${post.title}</td>
                <td class="p-3">${post.date}</td>
                <td class="p-3">
                    <button data-id="${post.id}" class="edit-btn text-blue-500 hover:underline mr-2">Edit</button>
                    <button data-id="${post.id}" class="delete-btn text-red-500 hover:underline">Hapus</button>
                </td>
            `;
            postsTableBody.appendChild(row);
        });
    }
    
    function getFormattedDate() {
        const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        const date = new Date();
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }

    function resetForm() {
        postForm.reset();
        postIdInput.value = '';
        submitBtn.textContent = 'Publikasikan';
        submitBtn.classList.remove('bg-green-500', 'hover:bg-green-700');
        submitBtn.classList.add('bg-blue-500', 'hover:bg-blue-700');
    }

    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = postTitleInput.value.trim();
        const content = postContentInput.value.trim();
        const id = postIdInput.value;

        if (!title || !content) {
            alert('Judul dan Konten tidak boleh kosong!');
            return;
        }

        if (id) {
            // Update existing post
            const postIndex = posts.findIndex(p => p.id == id);
            if (postIndex > -1) {
                posts[postIndex].title = title;
                posts[postIndex].content = content;
            }
        } else {
            // Create new post
            const newPost = {
                id: Date.now(), // simple unique ID
                title,
                content,
                date: getFormattedDate(),
                imageUrl: `https://picsum.photos/400/${250 + posts.length}`
            };
            posts.unshift(newPost); // Add to the beginning of the array
        }
        
        alert('Data berhasil disimpan (simulasi). Perubahan akan hilang saat refresh.');
        renderTable();
        resetForm();
    });

    postsTableBody.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.dataset.id;

        if (target.classList.contains('edit-btn')) {
            const postToEdit = posts.find(p => p.id == id);
            if (postToEdit) {
                postIdInput.value = postToEdit.id;
                postTitleInput.value = postToEdit.title;
                postContentInput.value = postToEdit.content;
                submitBtn.textContent = 'Update Post';
                submitBtn.classList.remove('bg-blue-500', 'hover:bg-blue-700');
                submitBtn.classList.add('bg-green-500', 'hover:bg-green-700');
                window.scrollTo(0, 0);
            }
        }

        if (target.classList.contains('delete-btn')) {
            if (confirm('Apakah Anda yakin ingin menghapus postingan ini?')) {
                posts = posts.filter(p => p.id != id);
                alert('Data berhasil dihapus (simulasi). Perubahan akan hilang saat refresh.');
                renderTable();
                resetForm();
            }
        }
    });

    // Initial load
    fetchPosts();
});