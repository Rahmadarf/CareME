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


//Register Page
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const passwordConfirm = document.getElementById('passwordConfirm');
const telepon = document.getElementById('phone');
const username = document.getElementById('username');

document.getElementById('registerBtn').addEventListener('click', async () => {
    const email = registerEmail.value;
    const password = registerPassword.value;
    const confirmPassword = passwordConfirm.value;
    const phone = telepon.value;
    const user = username.value;

    if (email === '' || password === '' || phone === '' || user === '') {
        Swal.fire({
            icon: 'error',
            confirmButtonColor: '#00C9A7',
            title: 'Gagal Register',
            text: 'Silahkan Lengkapi Data Terlebih Dahulu',
        }).then(() => {
            return;
        });
    } else if (password !== confirmPassword) {
        Swal.fire({
            icon: 'error',
            confirmButtonColor: '#00C9A7',
            title: 'Gagal Register',
            text: 'Password dan Konfirmasi Password Tidak Sesuai',
        });
        return;
    }

    const { data: existingUser, error: fetchError } = await supabaseClient
        .from('User')
        .select('*')
        .eq('email', email)

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

    if (existingUser && existingUser.length > 0) {
        Swal.fire({
            icon: 'info',
            confirmButtonColor: '#00C9A7',
            title: 'Email Sudah Terdaftar',
            text: 'Silahkan Gunakan Email Lain',
        });
        return
    }

    const { data, error } = await supabaseClient
        .from('User')
        .insert([
            { email: email, password: password, no_telepon: phone, nama_lengkap: user },
        ]);

    if (error) {
        console.error('Error inserting user:', error);
        Swal.fire({
            icon: 'error',
            confirmButtonColor: '#00C9A7',
            title: 'Gagal Register',
            text: 'Terjadi kesalahan saat mendaftar.',
        });
    } else {
        console.log('User registered:', user);
        Swal.fire({
            icon: 'success',
            confirmButtonColor: '#00C9A7',
            title: 'Berhasil Register',
            text: `Selamat Datang ${user}`,
        }).then(() => {
            window.location.href = 'dashboard.html';
            document.getElementById("email").value = '';
            document.getElementById("password").value = '';
            document.getElementById("phone").value = '';
            document.getElementById("user").value = '';
        });

    }
});