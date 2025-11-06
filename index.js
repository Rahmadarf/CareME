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

window.showPage = function (pageId) {
    document.querySelectorAll('.page').forEach(div => div.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');

}

const { data: users, error } = await supabaseClient
    .from('User')
    .select('*');


document.getElementById('addUser').addEventListener('click', () => {
    document.getElementById('addUserModal').classList.remove('hidden')
    document.getElementById('close').addEventListener('click', () => {
        email.value = ''
        password.value = ''
        passwordConfirm.value = ''
        phone.value = ''
        username.value = ''
        document.getElementById('addUserModal').classList.add('hidden')
    })
})


//addUser
const email = document.getElementById('addEmail');
const password = document.getElementById('addPassword');
const passwordConfirm = document.getElementById('addPasswordConfirm');
const phone = document.getElementById('addPhone');
const username = document.getElementById('addUsername');

document.getElementById('addUserBtn').addEventListener('click', async () => {

    if (email.value === '' || password.value === '' || phone.value === '' || username.value === '') {
        Swal.fire({
            icon: 'error',
            confirmButtonColor: '#00C9A7',
            title: 'Gagal Register',
            text: 'Silahkan Lengkapi Data Terlebih Dahulu',
        });
        return;
    } else if (password.value !== passwordConfirm.value) {
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
            { email: email.value, password: password.value, no_telepon: phone.value, nama_lengkap: username.value },
        ])
        .select();

    if (error) {
        console.error('Error inserting user:', error);
        Swal.fire({
            icon: 'error',
            confirmButtonColor: '#00C9A7',
            title: 'Gagal Register',
            text: 'Terjadi kesalahan saat menambahkan.',
        });
        return;
    } else {
        Swal.fire({
            icon: 'success',
            confirmButtonColor: '#00C9A7',
            title: 'Berhasil Menambahkan',
            text: `Menambah ${username.value}`,
        }).then(() => {
            document.getElementById('addUserModal').classList.add('hidden')
            email.value = ''
            password.value = ''
            passwordConfirm.value = ''
            phone = ''
            username = ''
        });
        return;
    }
});