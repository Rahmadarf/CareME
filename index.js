
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
        confirmButtonColor: '#2563EB',
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

window.showPage = function (pageId) {
    document.querySelectorAll('.page').forEach(div => div.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
    if (pageId == 'users') {
    }

}

const email = document.getElementById('addEmail');
const password = document.getElementById('addPassword');
const passwordConfirm = document.getElementById('addPasswordConfirm');
const phone = document.getElementById('addPhone');
const username = document.getElementById('addUsername');


//addUser
document.getElementById('addUser').addEventListener('click', async () => {
    const { value: formValues } = await Swal.fire({
        title: "Tambah Pengguna Baru",
        html: `
            <div>
                <div class="flex gap-x-5">
                    <div>
                        <label for="addUsername" class="font-montserrat font-medium">Nama Lengkap</label>
                        <input id="addUsername" type="text" placeholder="John bin Jono"
                            class="w-full h-[50px] border border-outline rounded-lg px-4 mt-2 mb-6 focus:outline-none">
                    </div>
                    <div>
                        <label for="addPhone" class="font-montserrat font-medium">No. Telepon</label>
                        <input id="addPhone" type="tel" placeholder="08123456789"
                            class="w-full h-[50px] border border-outline rounded-lg px-4 mt-2 mb-6 focus:outline-none">
                    </div>
                </div>

                <div class="flex gap-x-5">
                    <div class="w-full">
                        <label for="addEmail" class="font-montserrat font-medium">Email</label>
                        <input id="addEmail" type="email" required placeholder="john@email.com"
                            class="w-full h-[50px] border border-outline rounded-lg px-4 mt-2 mb-6 focus:outline-none">
                    </div>
                </div>

                <div class="flex gap-x-5">
                    <div>
                        <label for="addPassword" class="font-montserrat font-medium">Password</label>
                        <input id="addPassword" type="password" placeholder="Masukan Password"
                            class="w-full h-[50px] border border-outline rounded-lg px-4 mt-2 mb-6 focus:outline-none">
                    </div>
                    <div>
                        <label for="addPasswordConfirm" class="font-montserrat font-medium">Konfirmasi Password</label>
                        <input id="addPasswordConfirm" type="password" placeholder="Konfirmasi Password"
                            class="w-full h-[50px] border border-outline rounded-lg px-4 mt-2 mb-6 focus:outline-none">
                    </div>
                </div>

                <select name="role" id="addRole" class='bg-gray py-3 px-5 rounded-lg focus:border-0'>
                    <option value="pasien" selected>Pasien</option>
                    <option value="perawat">Perawat</option>
                    <option value="dokter">Dokter</option>
                </select>
            </div>`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Tambahkan',
        confirmButtonColor: '#2563EB',

        preConfirm: async () => {
            const username = document.getElementById("addUsername").value.trim();
            const phone = document.getElementById("addPhone").value.trim();
            const email = document.getElementById("addEmail").value.trim();
            const password = document.getElementById("addPassword").value;
            const passwordConfirm = document.getElementById("addPasswordConfirm").value;
            const selectRole = document.getElementById('addRole').value.trim()

            if (!username || !phone || !email || !password || !passwordConfirm) {
                Swal.showValidationMessage(`Harap lengkapi semua data!`);
                return false;
            }
            if (password !== passwordConfirm) {
                Swal.showValidationMessage(`Password dan konfirmasi tidak cocok!`);
                return false;
            }
            if (!email.includes('@')) {
                Swal.showValidationMessage('Pastikan menggunakan email yang valid')
            }
            if (!selectRole) {
                Swal.showValidationMessage('Pastikan memilih role user')
            }

            // 🔍 Cek email
            const { data: existingUser, error: fetchError } = await supabaseClient
                .from('User')
                .select('*')
                .eq('email', email);

            if (fetchError) {
                Swal.showValidationMessage('Gagal memeriksa email!');
                return false;
            }

            if (existingUser && existingUser.length > 0) {
                Swal.showValidationMessage('Email sudah digunakan, gunakan email lain!');
                return false;
            }

            // 🔍 Cek nomor telepon
            const { data: existingPhone, error: fetchPhoneError } = await supabaseClient
                .from('User')
                .select('*')
                .eq('no_telepon', phone);

            if (fetchPhoneError) {
                Swal.showValidationMessage('Gagal memeriksa nomor telepon!');
                return false;
            }

            if (existingPhone && existingPhone.length > 0) {
                Swal.showValidationMessage('Nomor telepon sudah digunakan!');
                return false;
            }

            // Jika semua aman, return data
            return { username, phone, email, password, selectRole };

            Swal.showLoading()
        }
    });

    if (!formValues) return;

    const { username, phone, email, password, selectRole } = formValues;

    // ✅ Insert user baru
    const { data, error } = await supabaseClient
        .from('User')
        .insert([
            { nama_lengkap: username, no_telepon: phone, email: email, password: password, role: selectRole }
        ])
        .select();

    if (error) {
        Swal.fire({
            icon: 'error',
            confirmButtonColor: '#2563EB',
            title: 'Gagal Menambahkan',
            text: 'Terjadi kesalahan saat menyimpan data.',
        });
        return;
    }

    Swal.fire({
        icon: 'success',
        confirmButtonColor: '#2563EB',
        title: 'Berhasil Menambahkan!',
        text: `Pengguna ${username} berhasil ditambahkan.`,
    });

    loadUsers(currentPage);
});



let currentPage = 1
const limit = 5
let totalData = 0

async function loadUsers(page = 1) {
    const tableUsers = document.getElementById('usersTable')

    const start = (page - 1) * limit
    const end = start + limit - 1

    const { data, error } = await supabaseClient
        .from('User')
        .select('*')
        .range(start, end)
        .neq('role', 'admin')

    if (error) {
        console.error('Gagal menampilkan users:', error)
        tableUsers.innerHTML = `<tr><td colspan="5" class="p-3">Gagal memuat data</td></tr>`
    }


    const { count } = await supabaseClient
        .from('User')
        .select('*', { count: 'exact', head: true })
        .neq('role', 'admin');

    totalData = count

    tableUsers.innerHTML = ''

    data.forEach((user, index) => {
        const row = `
            <tr class="border-t border-light-gray">
                <td class="p-3 font-montserrat font-medium text-main-gray">${start + index + 1}</td>
                <td class="p-3 font-montserrat font-medium text-main-gray">${user.nama_lengkap}</td>
                <td class="p-3 font-montserrat font-medium text-main-gray">${user.email}</td>
                <td class="p-3 font-montserrat font-medium text-main-gray">${user.no_telepon}</td>
                <td class="p-3 font-montserrat font-medium text-main-gray">${user.role}</td>
                <td class="p-3 font-montserrat font-medium text-main-gray flex gap-x-5 justify-center">
                    <button class="bg-blue-600 px-3 py-2 rounded-lg cursor-pointer flex gap-x-3 text-black items-center" onclick="editUser('${user.id}')"><img src="/img/square-pen.svg"> Edit</button>
                    <button class="bg-red-500 py-2 px-3 rounded-lg cursor-pointer flex gap-x-3 text-black items-center" onclick="deleteUser('${user.id}')"><img src="/img/trash-2.svg"> Hapus</button>
                </td>
            </tr>`


        tableUsers.insertAdjacentHTML('beforeend', row)
    })

    const pageInfo = document.getElementById('pageInfo')
    const totalPage = Math.ceil(totalData / limit)
    pageInfo.innerHTML = page

    if (!data || data.length === 0) {
        tableUsers.innerHTML = `<tr><td colspan="5" class="p-3">Tidak ada data pengguna</td></tr>`
        totalData = count || 0
        document.getElementById('prevPage').disabled = page === 1
        document.getElementById('nextPage').disabled = page >= totalPage
    }




}

window.deleteUser = async (id) => {
    console.log(`Bersiap menghapus user dengan id ${id}`)

    const result = await Swal.fire({
        title: 'Hapus Pengguna?',
        text: 'Data pengguna akan dihapus permanen.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#e53e3e'
    });

    if (!result.isConfirmed) return;

    const { error } = await supabaseClient
        .from('User')
        .delete()
        .eq('id', id);

    if (error) {
        Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Tidak dapat menghapus pengguna.',
            confirmButtonColor: '#2563EB'
        });
        return;
    }

    Swal.fire({
        icon: 'success',
        title: 'Terhapus',
        text: 'Pengguna berhasil dihapus.',
        confirmButtonColor: '#2563EB'
    });

    loadUsers(currentPage);
}


//edit
window.editUser = async (id) => {
    console.log(`Edit User dengan id ${id}`)

    const { data, error } = await supabaseClient
        .from('User')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Gagal mengambil data user:', error);
        Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: 'Tidak dapat mengambil data pengguna.',
            confirmButtonColor: '#2563EB'
        });
        return;
    }

    console.log("Data user ditemukan:", data);

    //edit User
    const { value: formValues } = await Swal.fire({
        title: `Edit Pengguna: ${data.nama_lengkap}`,
        html: `
            <div>
                <div class="flex gap-x-5">
                    <div>
                        <label for="editUsername" class="font-montserrat font-medium">Nama Lengkap</label>
                        <input id="editUsername" type="text" placeholder="John bin Jono"
                            class="w-full h-[50px] border border-outline rounded-lg px-4 mt-2 mb-6 focus:outline-none" value="${data.nama_lengkap}">
                    </div>
                    <div>
                        <label for="editPhone" class="font-montserrat font-medium">No. Telepon</label>
                        <input id="editPhone" type="tel" placeholder="08123456789"
                            class="w-full h-[50px] border border-outline rounded-lg px-4 mt-2 mb-6 focus:outline-none" value="${data.no_telepon}">
                    </div>
                </div>

                <div class="flex gap-x-5">
                    <div class="w-full">
                        <label for="editEmail" class="font-montserrat font-medium">Email</label>
                        <input id="editEmail" type="email" required placeholder="john@email.com"
                            class="w-full h-[50px] border border-outline rounded-lg px-4 mt-2 mb-6 focus:outline-none" value="${data.email}">
                    </div>
                </div>

                <div class="flex gap-x-5">
                    <div class="w-full">
                        <label for="editEmail" class="font-montserrat font-medium">Nomor Telepon</label>
                        <input id="editEmail" type="email" required placeholder="john@email.com"
                            class="w-full h-[50px] border border-outline rounded-lg px-4 mt-2 mb-6 focus:outline-none" value="${data.no_telepon}">
                    </div>
                </div>

                <select name="role" id="editRole" class='bg-gray py-3 px-5 rounded-lg focus:border-0'>
                    <option value="${data.role}" selected disabled>${data.role}</option>
                    <option value="pasien" ${data.role === 'pasien' ? 'hidden' : ''}>Pasien</option>
                    <option value="perawat" ${data.role === 'perawat' ? 'hidden' : ''}>Perawat</option>
                    <option value="dokter" ${data.role === 'dokter' ? 'hidden' : ''}>Dokter</option>
                </select>
            </div>`,
        showCancelButton: true,
        confirmButtonText: 'Simpan Perubahan',
        confirmButtonColor: '#2563EB',
        preConfirm: () => {
            return {
                nama_lengkap: document.getElementById('editUsername').value.trim(),
                email: document.getElementById('editEmail').value.trim(),
                no_telepon: document.getElementById('editPhone').value.trim(),
                role: document.getElementById('editRole').value
            }
        }
    });

    // Kalau user klik "Batal", hentikan
    if (!formValues) return;

    // Update data di Supabase
    const { error: updateError } = await supabaseClient
        .from('User')
        .update({
            nama_lengkap: formValues.nama_lengkap,
            email: formValues.email,
            no_telepon: formValues.no_telepon,
            role: formValues.role
        })
        .eq('id', id);


    if (updateError) {
        Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: 'Tidak dapat menyimpan perubahan.',
            confirmButtonColor: '#2563EB'
        });
        return;
    }

    Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data pengguna berhasil diperbarui.',
        confirmButtonColor: '#2563EB'
    });

    // Refresh tabel
    loadUsers(currentPage);
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--
        loadUsers(currentPage)
    }
})

document.getElementById('nextPage').addEventListener('click', () => {
    const totalPage = Math.ceil(totalData / limit)
    if (currentPage < totalPage) {
        currentPage++
        loadUsers(currentPage)
    }
})

document.addEventListener('DOMContentLoaded', () => {
    loadUsers(currentPage)
})










