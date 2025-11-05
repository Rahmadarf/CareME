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

if (localStorage.getItem('sessionUser')) {
    window.location.href = 'index.html';
}

//Login Page
const email = document.getElementById('email');
const password = document.getElementById('password');

document.getElementById('loginBtn').addEventListener('click', async () => {
    if (email.value === '' || password.value === '') {
        Swal.fire({
            icon: 'error',
            confirmButtonColor: '#00C9A7',
            title: 'Gagal Login',
            text: 'Silahkan Lengkapi Data Terlebih Dahulu',
        });
        return;
    }

    const { data: existingUser, error: fetchError } = await supabaseClient
        .from('User')
        .select('*')
        .or(`email.eq.${email.value},nama_lengkap.eq.${email.value}`)
        .maybeSingle();

    if (fetchError) {
        console.error('Error fetching user:', fetchError);
        Swal.fire({
            icon: 'warning',
            confirmButtonColor: '#00C9A7',
            title: 'Error',
            text: 'Terjadi kesalahan saat memeriksa pengguna.',
        });
        return;
    }

    if (!existingUser) {
        Swal.fire({
            icon: 'info',
            confirmButtonColor: '#00C9A7',
            title: 'Email atau Username  Belum Terdaftar',
            text: 'Silahkan Daftar Terlebih Dahulu',
        });
        return;
    }

    if (existingUser.password !== password.value) {
        Swal.fire({
            icon: 'error',
            confirmButtonColor: '#00C9A7',
            title: 'Gagal Login',
            text: 'Password Salah, Silahkan Coba Lagi',
        });
        return;
    } else {
        Swal.fire({
            icon: 'success',
            confirmButtonColor: '#00C9A7',
            title: 'Berhasil Login',
            text: `Selamat Datang Kembali ${existingUser.nama_lengkap}`,
        }).then(() => {
            localStorage.setItem('sessionUser', JSON.stringify(existingUser));
            window.location.href = 'index.html';
            document.getElementById("email").value = '';
            document.getElementById("password").value = '';
        });
    }
});



// Register redirection
document.getElementById('register').addEventListener('click', () => {
    window.location.href = 'register.html';
})






