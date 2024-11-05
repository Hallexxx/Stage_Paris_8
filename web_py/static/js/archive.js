function showSection(section) {
    document.getElementById('archiveNews').style.display = section === 'news' ? 'block' : 'none';
    document.getElementById('archiveUsers').style.display = section === 'users' ? 'block' : 'none';
    document.getElementById('newsButton').classList.toggle('active', section === 'news');
    document.getElementById('usersButton').classList.toggle('active', section === 'users');
}

showSection('news');