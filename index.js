const { createClient } = supabase;

const supabaseUrl = 'https://qthrogwxjppfovcelwyh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0aHJvZ3d4anBwZm92Y2Vsd3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NzY2NzUsImV4cCI6MjA3NzQ1MjY3NX0.Z6j9MT2CHGWf32FnxViEWeRu1x-FrdWq1akfiZgWGSI';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

async function getAllUsers() {
    const { data, error } = await supabaseClient
        .from('User')
        .select('*');

    if (error) {
        console.error('Error:', error);
        return null;
    }
    console.log('Users:', data);
    return data;
}

document.getElementById('out').addEventListener('click', () => {
    Swal.fire({
        icon: 'question',
        confirmButtonColor: '#00C9A7',
        showCancelButton: true,
        title: 'Apakah Anda Yakin Ingin Keluar?',
        text: 'Anda Perlu Login Kembali Untuk Mengakses Halaman Ini',
        cancelButtonText: 'Batal',
        confirmButtonText: 'Keluar',
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('sessionUser');
            window.location.href = 'login.html';
        }
    });
})

if (!localStorage.getItem('sessionUser')) {
    window.location.href = 'login.html';
}

const user = JSON.parse(localStorage.getItem('sessionUser'));
document.getElementById('usernameDisplay').innerText = user.nama_lengkap;

if (user.role === 'pasien') {
    window.location.href = 'patient.html';
} else if (user.role === 'dokter') {
    window.location.href = 'doctor.html';
} else if (user.role === 'perawat') {
    window.location.href = 'nurse.html';
}

const pageId = 'users';

window.showPage = function(pageId) {
    document.querySelectorAll('.page').forEach(div => div.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
    
}

const { data: users, error } = await supabaseClient
    .from('User')
    .select('*');