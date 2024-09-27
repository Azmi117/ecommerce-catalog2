<script setup>
import { ref, onMounted, computed } from 'vue';
import { getProductById } from './services/apiServices.js';

const products = ref([]); // State untuk menyimpan produk valid
const currentProductIndex = ref(0); // Index produk saat ini
const isLoading = ref(true); // State untuk loading
const errorMessage = ref(''); // State untuk menangani error
const id = ref(1); // State untuk ID produk yang difetch
const MAX_ID = 20; // ID maksimal
const fetchingDone = ref(false); // State untuk menandai apakah fetching sudah selesai

// Fungsi untuk memeriksa kategori
const isValidCategory = (category) => {
  return category === "men's clothing" || category === "women's clothing";
};

// Fungsi untuk fetch product
const fetchProduct = async () => {
  try {
    if (fetchingDone.value) return; // Jika fetching sudah selesai, keluar dari fungsi
    isLoading.value = true; // Set loading true sebelum fetch
    const data = await getProductById(id.value); // Fetch produk berdasarkan ID

    // Jika kategori valid, simpan produk
    if (isValidCategory(data.category)) {
      products.value.push(data); // Tambahkan produk ke array
    } else {
      // Jika kategori tidak valid, simpan produk sebagai tidak tersedia
      products.value.push({ ...data, available: false }); // Tambahkan produk dengan properti available
    }
  } catch (error) {
    errorMessage.value = 'Failed to load product. Please try again.'; // Tangani error
  } finally {
    isLoading.value = false; // Set loading false setelah fetch selesai

    // Cek jika ID sudah mencapai MAX_ID
    if (id.value >= MAX_ID) {
      fetchingDone.value = true; // Tandai fetching selesai
    } else {
      loadNextId(); // Load ID berikutnya
    }
  }
};

// Panggil fetchProduct ketika komponen di-mount
onMounted(() => {
  fetchProduct(); // Ambil produk pertama di awal
});

// Fungsi untuk menampilkan produk saat ini
const currentProduct = computed(() => {
  return products.value[currentProductIndex.value]; // Ambil produk saat ini
});

// Fungsi untuk menampilkan produk berikutnya
const nextProduct = () => {
  if (products.value.length > 0) {
    currentProductIndex.value = (currentProductIndex.value + 1) % products.value.length; // Update index dengan sisa
  }
};

// Mengambil produk dengan ID yang berbeda
const loadNextId = () => {
  id.value = (id.value % MAX_ID) + 1; // Update ID untuk produk berikutnya
  fetchProduct(); // Fetch produk baru
};

</script>

<template>
  <div :class="[currentProduct ? (currentProduct.available !== false ? (currentProduct.category === 'men\'s clothing' ? 'bg-men' : 'bg-women') : 'bg-unavailable') : '']" class="h-[70vh] pt-20 transition-bg">
    <div class="shadow-md w-2/4 bg-white rounded-sm mx-auto relative">
      <!-- Overlay untuk spinner -->
      <div v-if="isLoading" class="absolute inset-0 flex justify-center items-center bg-white z-10">
        <div class="spinner"></div>
      </div>
      <div class="content">
        <div v-if="errorMessage">{{ errorMessage }}</div>
        <div v-else-if="currentProduct" class="grid grid-cols-5 gap-3">
          <img :src="currentProduct.image" alt="Product Image" class="w-60 h-80 col-span-2 p-3">
          <div class="col-span-3 pe-9">
            <h2 :class="[currentProduct.available !== false ? (currentProduct.category === 'men\'s clothing' ? 'teks-men' : 'teks-women') : '']" class="text-xl font-bold mt-7 mb-5">{{ currentProduct.title }}</h2>
            <div class="flex justify-between">
              <p class="mb-1">{{ currentProduct.category }}</p>
              <p v-if="currentProduct.available === false" class="text-red-500 mt-4">This product is not available</p>
            </div>
            <hr>
            <p class="mt-2 mb-10">{{ currentProduct.description }}</p>
            <hr>
            <p :class="[currentProduct.available !== false ? (currentProduct.category === 'men\'s clothing' ? 'teks-men' : 'teks-women') : '']" class="text-lg font-semibold mt-4">${{ currentProduct.price }}</p>
            <div class="flex gap-5 mb-3">
              <button :class="[currentProduct.available !== false ? (currentProduct.category === 'men\'s clothing' ? 'bg-men2' : 'bg-women2') : '']" class="w-28 text-white my-2 py-0.5 transform scale-100 hover:scale-110 transition duration-300" v-if="currentProduct.available !== false">Buy Now</button>
              <button :class="[
                currentProduct.available !== false 
                  ? (currentProduct.category === 'men\'s clothing' ? 'border-col-men teks-men' : 'border-col-women teks-women') 
                  : 'border-gray-500 text-gray-500' // Jika unavailable, set warna border ke abu-abu
              ]" @click="nextProduct" class="w-28 bg-white h-[28px] border-2 transform scale-100 hover:scale-110 transition duration-300 mt-2">Next Product</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* Define the background color for men's and women's clothing */
.bg-men {
  background-color: #D6E6FF;
}

.border-gray-500 {
  border-color: #DCDCDC; /* Abu-abu */
}

.text-gray-500 {
  color: #000; /* Abu-abu */
}


.teks-men {
  color: #002772;
}

.bg-men2{
  background-color: #002772;
}

.bg-women {
  background-color: #FDE2FF;
}

.bg-women2{
  background-color: #720060;
}

.teks-women{
  color: #720060;
}

.border-col-men{
  border-color: #002772;
}

.border-col-women{
  border-color: #720060;
}

/* Add transition to the background color */
.transition-bg {
  transition: background-color 0.5s ease-in-out;
}

/* New style for unavailable products */
.bg-unavailable {
  background-color: #E0E0E0; /* Color for unavailable products */
}

/* Styles for the spinner */
.spinner {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

/* Spinner animation */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Styles for the content */
.content {
  position: relative; /* Make sure content is positioned relative for the overlay to work */
}
</style>
