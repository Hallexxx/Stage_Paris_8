function showSection(section) {
    document.getElementById('archiveNews').style.display = section === 'news' ? 'block' : 'none';
    document.getElementById('archiveUsers').style.display = section === 'users' ? 'block' : 'none';
}