const { createClient } = supabase;

const supabaseUrl = 'https://qthrogwxjppfovcelwyh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0aHJvZ3d4anBwZm92Y2Vsd3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NzY2NzUsImV4cCI6MjA3NzQ1MjY3NX0.Z6j9MT2CHGWf32FnxViEWeRu1x-FrdWq1akfiZgWGSI';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

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
            confirmButtonColor: '#2563EB',
            title: 'Gagal Login',
            text: 'Silahkan Lengkapi Data Terlebih Dahulu',
        });
        return;
    }

    document.getElementById('loginBtn').classList.add('opacity-70', 'pointer-events-none')
    document.getElementById('loginBtn').innerHTML = `<img class="animate-spin w-7" src="img/loader-circle.svg" alt=""> 
                                                    <span class="ml-2 font-montserrat">Memproses...</span>
`

    await delay(1500)

    const inputValue = encodeURIComponent(email.value);

    const { data: existingUser, error: fetchError } = await supabaseClient
        .from('User')
        .select('*')
        .or(`email.eq.${inputValue},nama_lengkap.eq.${inputValue}`)
        .limit(1)
        .maybeSingle();

    if (fetchError) {
        console.error('Error fetching user:', fetchError);
        Swal.fire({
            icon: 'warning',
            confirmButtonColor: '#2563EB',
            title: 'Error',
            text: 'Terjadi kesalahan saat memeriksa pengguna.',
        });
        document.getElementById('loginBtn').classList.remove('opacity-70', 'pointer-events-none');
        document.getElementById('loginBtn').innerHTML = `Masuk`
        return;
    }

    if (!existingUser) {
        Swal.fire({
            icon: 'info',
            confirmButtonColor: '#2563EB',
            title: 'Email atau Username  Belum Terdaftar',
            text: 'Silahkan Daftar Terlebih Dahulu',
        });
        document.getElementById('loginBtn').classList.remove('opacity-70', 'pointer-events-none');
        document.getElementById('loginBtn').innerHTML = `Masuk`
        return;
    }

    if (existingUser.password !== password.value) {
        Swal.fire({
            icon: 'error',
            confirmButtonColor: '#2563EB',
            title: 'Gagal Login',
            text: 'Password Salah, Silahkan Coba Lagi',
        });
        document.getElementById('loginBtn').classList.remove('opacity-70', 'pointer-events-none');
        document.getElementById('loginBtn').innerHTML = `Masuk`
        return;
    } else {
        localStorage.setItem('sessionUser', JSON.stringify(existingUser));
        Swal.fire({
            icon: 'success',
            confirmButtonColor: '#2563EB',
            title: 'Berhasil Login',
            text: `Selamat Datang Kembali ${existingUser.nama_lengkap}`,
        }).then(() => {
            if (existingUser.role === 'pasien') {
                window.location.href = 'patient.html';
            } else if (existingUser.role === 'dokter') {
                window.location.href = 'doctor.html';
            } else if (existingUser.role === 'perawat') {
                window.location.href = 'nurse.html';
            } else if (existingUser.role === 'admin') {
                window.location.href = 'index.html';
            }
            document.getElementById("email").value = '';
            document.getElementById("password").value = '';
        });
        document.getElementById('loginBtn').classList.remove('opacity-70', 'pointer-events-none');
        document.getElementById('loginBtn').innerHTML = `Masuk`
    }
});



// Register redirection
document.getElementById('register').addEventListener('click', () => {
    window.location.href = 'register.html';
})






