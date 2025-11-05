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


//Register Page
const email = document.getElementById('registerEmail');
const password = document.getElementById('registerPassword');
const passwordConfirm = document.getElementById('passwordConfirm');
const phone = document.getElementById('phone');
const user = document.getElementById('username');
const hashPassword = bcrypt.hashSync(password.value, 10);

document.getElementById('registerBtn').addEventListener('click', async () => {

    if (email.value === '' || password.value === '' || phone.value === '' || username.value === '') {
        Swal.fire({
            icon: 'error',
            confirmButtonColor: '#00C9A7',
            title: 'Gagal Register',
            text: 'Silahkan Lengkapi Data Terlebih Dahulu',
        });
        return;
    } else if (registerPassword.value !== passwordConfirm.value) {
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
        .eq('email', email.value);

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


    const { data: existingPhone, error: fetchPhoneError } = await supabaseClient
        .from('User')
        .select('*')
        .eq('no_telepon', phone.value);

    if (fetchPhoneError) {
        console.error('Error fetching phone:', fetchPhoneError);
        Swal.fire({
            icon: 'warning',
            confirmButtonColor: '#00C9A7',
            title: 'Error',
            text: 'Terjadi kesalahan saat memeriksa nomor telepon.',
        });
        return;
    }

    if (existingPhone && existingPhone.length > 0) {
        Swal.fire({
            icon: 'info',
            confirmButtonColor: '#00C9A7',
            title: 'Nomor Telepon Sudah Terdaftar',
            text: 'Silahkan Gunakan Nomor Telepon Lain',
        });
        return;
    }

    const { data, error } = await supabaseClient
        .from('User')
        .insert([
            { email: email.value, password: hashPassword, no_telepon: phone.value, nama_lengkap: user.value },
        ])
        .select();

    if (error) {
        console.error('Error inserting user:', error);
        Swal.fire({
            icon: 'error',
            confirmButtonColor: '#00C9A7',
            title: 'Gagal Register',
            text: 'Terjadi kesalahan saat mendaftar.',
        });
        return;
    } else {
        Swal.fire({
            icon: 'success',
            confirmButtonColor: '#00C9A7',
            title: 'Berhasil Register',
            text: `Selamat Datang ${user.value}`,
        }).then(() => {
            localStorage.setItem('sessionUser', JSON.stringify(data[0]));
            window.location.href = 'patient.html';
            document.getElementById("email").value = '';
            document.getElementById("password").value = '';
            document.getElementById("phone").value = '';
            document.getElementById("user").value = '';
        });
        return;
    }
});


//Navigation to Login Page
document.getElementById('login').addEventListener('click', () => {
    window.location.href = 'login.html';
});