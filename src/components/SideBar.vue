<template>
  <div class="relative bg-gray-800">
    <div class="flex flex-col">
      <div class="h-screen">
        <div class="flex flex-col items-start justify-start mx-6 mt-5">
          <h2 class="text-sm font-medium text-[#6675c9]">Name: {{ name }}</h2>
          <h2 class="text-sm font-medium text-[#6675c9]">ID: {{ id }}</h2>
          <h2 class="text-sm font-medium text-[#6675c9]">Age: {{ age }}</h2>
        </div>
        <nav class="mt-3 px-6">
          <a class="border-l-4 border-l-transparent flex items-center p-2 my-2 transition-colors duration-200" :class="{
            'border-l-white bg-[#3f51b5] text-white': activeSection === 'admin',
            'text-gray-500 hover:bg-[#3f51b5] hover:text-white': activeSection !== 'admin'
          }" @click="setActiveSection('admin')" href="#">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <span class="mx-4 text-sm font-medium"> Admin </span>
          </a>
          <a class="border-l-4 border-l-transparent flex items-center p-2 my-2 transition-colors duration-200" :class="{
            'border-l-white bg-[#3f51b5] text-white': activeSection === 'past-med-hist',
            'text-gray-500 hover:bg-[#3f51b5] hover:text-white': activeSection !== 'past-med-hist'
          }" @click="setActiveSection('past-med-hist')" href="#">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_160_2751)">
                <path
                  d="M12.1428 4.99993V3.57136C12.1428 3.19248 11.9923 2.82912 11.7244 2.56121C11.4565 2.29331 11.0932 2.14279 10.7143 2.14279H9.28571"
                  stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M5.71429 14.9999H2.14287C1.76398 14.9999 1.40062 14.8494 1.13271 14.5815C0.864804 14.3137 0.714294 13.9503 0.714294 13.5714V3.57136C0.714294 3.19248 0.864804 2.82912 1.13271 2.56121C1.40062 2.29331 1.76398 2.14279 2.14287 2.14279H3.57144"
                  stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M17.8571 7.85707H10.7143C9.92531 7.85707 9.28571 8.49667 9.28571 9.28564V17.8571C9.28571 18.6461 9.92531 19.2856 10.7143 19.2856H17.8571C18.6461 19.2856 19.2857 18.6461 19.2857 17.8571V9.28564C19.2857 8.49667 18.6461 7.85707 17.8571 7.85707Z"
                  stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M9.64287 0.714218H3.21429L3.80001 3.0285C3.83569 3.1834 3.92302 3.32155 4.04765 3.4202C4.17228 3.51886 4.32677 3.57217 4.48572 3.57136H8.37144C8.5304 3.57217 8.68488 3.51886 8.80951 3.4202C8.93414 3.32155 9.02147 3.1834 9.05715 3.0285L9.64287 0.714218Z"
                  stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M12.1429 12.1428H16.4286" stroke="currentcolor" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M12.1429 14.9999H16.4286" stroke="currentcolor" stroke-linecap="round"
                  stroke-linejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_160_2751">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <span class="mx-4 text-sm font-medium"> Past Medical History </span>
            <span class="flex-grow text-right"> </span>
          </a>
          <a class="border-l-4 border-l-transparent flex items-center p-2 my-2 transition-colors duration-200" :class="{
            'border-l-white bg-[#3f51b5] text-white': activeSection === 'social-hist',
            'text-gray-500 hover:bg-[#3f51b5] hover:text-white': activeSection !== 'social-hist'
          }" @click="setActiveSection('social-hist')" href="#">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.14284 9.28571C9.11528 9.28571 10.7143 7.68672 10.7143 5.71428C10.7143 3.74184 9.11528 2.14285 7.14284 2.14285C5.1704 2.14285 3.57141 3.74184 3.57141 5.71428C3.57141 7.68672 5.1704 9.28571 7.14284 9.28571Z"
                stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M0.714294 19.2857H7.14287H13.5714V18.5113C13.5601 17.4224 13.2729 16.3541 12.7368 15.4064C12.2006 14.4586 11.433 13.6621 10.5056 13.0914C9.57822 12.5207 8.52131 12.1944 7.43361 12.1429C7.33664 12.1383 7.2397 12.1359 7.14287 12.1357C7.04604 12.1359 6.9491 12.1383 6.85212 12.1429C5.76442 12.1944 4.70751 12.5207 3.78011 13.0914C2.85272 13.6621 2.08511 14.4586 1.54897 15.4064C1.01283 16.3541 0.725667 17.4224 0.714294 18.5113V19.2857Z"
                stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M12.8572 9.28571C14.8296 9.28571 16.4286 7.68672 16.4286 5.71428C16.4286 3.74184 14.8296 2.14285 12.8572 2.14285"
                stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M16.4286 19.2859H19.2857V18.5113C19.2743 17.4224 18.9871 16.3541 18.451 15.4064C17.9148 14.4586 17.1473 13.6622 16.2198 13.0915C15.6204 12.7225 14.9667 12.4557 14.2857 12.2993"
                stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <span class="mx-4 text-sm font-medium"> Social History </span>
            <span class="flex-grow text-right"> </span>
          </a>
          <a class="border-l-4 border-l-transparent flex items-center p-2 my-2 transition-colors duration-200" :class="{
            'border-l-white bg-[#3f51b5] text-white': activeSection === 'vital-stats',
            'text-gray-500 hover:bg-[#3f51b5] hover:text-white': activeSection !== 'vital-stats'
          }" @click="setActiveSection('vital-stats')" href="#">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13.5714 2.14285H15.7143C16.0931 2.14285 16.4565 2.29337 16.7244 2.56127C16.9923 2.82918 17.1428 3.19254 17.1428 3.57142V17.8571C17.1428 18.236 16.9923 18.5994 16.7244 18.8673C16.4565 19.1351 16.0931 19.2857 15.7143 19.2857H4.28569C3.9068 19.2857 3.54345 19.1351 3.27553 18.8673C3.00763 18.5994 2.85712 18.236 2.85712 17.8571V3.57142C2.85712 3.19254 3.00763 2.82918 3.27553 2.56127C3.54345 2.29337 3.9068 2.14285 4.28569 2.14285H6.42855"
                stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M12.1428 0.714279H7.8571C7.06813 0.714279 6.42853 1.35387 6.42853 2.14285V2.85714C6.42853 3.64611 7.06813 4.28571 7.8571 4.28571H12.1428C12.9318 4.28571 13.5714 3.64611 13.5714 2.85714V2.14285C13.5714 1.35387 12.9318 0.714279 12.1428 0.714279Z"
                stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M9.00389 7.44279C8.66512 7.44279 8.39049 7.71742 8.39049 8.05621V9.78144H6.66528C6.32651 9.78144 6.05188 10.0561 6.05188 10.3948V12.3884C6.05188 12.7272 6.32651 13.0018 6.66528 13.0018H8.39049V14.727C8.39049 15.0657 8.66512 15.3404 9.00389 15.3404H10.9975C11.3362 15.3404 11.6109 15.0657 11.6109 14.727V13.0018H13.3361C13.6749 13.0018 13.9495 12.7272 13.9495 12.3884V10.3948C13.9495 10.0561 13.6749 9.78144 13.3361 9.78144H11.6109V8.05621C11.6109 7.71742 11.3362 7.44279 10.9975 7.44279H9.00389Z"
                stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <span class="mx-4 text-sm font-medium"> Vital Statistics </span>
            <span class="flex-grow text-right"> </span>
          </a>

          <a class="border-l-4 border-l-transparent flex items-center p-2 my-2 transition-colors duration-200" :class="{
            'border-l-white bg-[#3f51b5] text-white': activeSection === 'height-weight',
            'text-gray-500 hover:bg-[#3f51b5] hover:text-white': activeSection !== 'height-weight'
          }" @click="setActiveSection('height-weight')" href="#">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_160_2784)">
                <path
                  d="M7.14284 7.85714C9.11528 7.85714 10.7143 6.25815 10.7143 4.28571C10.7143 2.31326 9.11528 0.714279 7.14284 0.714279C5.1704 0.714279 3.57141 2.31326 3.57141 4.28571C3.57141 6.25815 5.1704 7.85714 7.14284 7.85714Z"
                  stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M7.14287 17.8572H0.714294V17.0827C0.725667 15.9939 1.01283 14.9256 1.54897 13.9778C2.08511 13.03 2.85272 12.2336 3.78011 11.6629C4.70751 11.0922 5.76442 10.7658 6.85212 10.7143C6.9491 10.7098 7.04604 10.7074 7.14287 10.7072C7.2397 10.7074 7.33665 10.7098 7.43362 10.7143C8.52132 10.7658 9.57824 11.0922 10.5056 11.6629C11.0389 11.9911 11.5194 12.3939 11.9334 12.8572"
                  stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M19.2857 12.1429L13.5714 19.2857L10.7143 17.1429" stroke="currentcolor" stroke-linecap="round"
                  stroke-linejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_160_2784">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <span class="mx-4 text-sm font-medium"> Height and Weight </span>
            <span class="flex-grow text-right"> </span>
          </a>
          <a class="border-l-4 border-l-transparent flex items-center p-2 my-2 transition-colors duration-200" :class="{
            'border-l-white bg-[#3f51b5] text-white': activeSection === 'visual-acuity',
            'text-gray-500 hover:bg-[#3f51b5] hover:text-white': activeSection !== 'visual-acuity'
          }" @click="setActiveSection('visual-acuity')" href="#">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 5.17856C4.01817 5.17856 1.50671 10.558 1.50671 10.6696C1.50671 10.7812 4.01817 16.1607 10 16.1607C15.9819 16.1607 18.4933 10.7812 18.4933 10.6696C18.4933 10.558 15.9819 5.17856 10 5.17856Z"
                stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3.09852 8.30355L0.871948 6.077" stroke="currentcolor" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M7.33552 5.56905L6.42792 2.63287" stroke="currentcolor" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M16.9016 8.30355L19.128 6.077" stroke="currentcolor" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M12.6646 5.56905L13.5722 2.63287" stroke="currentcolor" stroke-linecap="round"
                stroke-linejoin="round" />
              <path
                d="M9.44582 13.0902C10.7825 13.3963 12.1142 12.5608 12.4202 11.2242C12.7263 9.88755 11.8909 8.55585 10.5542 8.24977C9.2176 7.94369 7.8859 8.77912 7.57982 10.1158C7.27374 11.4524 8.10917 12.7841 9.44582 13.0902Z"
                stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <span class="mx-4 text-sm font-medium"> Visual Acuity </span>
            <span class="flex-grow text-right"> </span>
          </a>

          <a class="border-l-4 border-l-transparent flex items-center p-2 my-2 transition-colors duration-200" :class="{
            'border-l-white bg-[#3f51b5] text-white': activeSection === 'fall-risk',
            'text-gray-500 hover:bg-[#3f51b5] hover:text-white': activeSection !== 'fall-risk'
          }" @click="setActiveSection('fall-risk')" href="#">
            <svg width="20" height="20" fill="none" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"
              stroke="#ffffff">
              <path
                d="M30.052 8.772l-0.337-0.659c-0.372-0.728-1.263-1.018-1.992-0.646l-5.919 3.022c-0.316 0.161-0.549 0.42-0.681 0.721-0.078 0.102-0.143 0.215-0.194 0.34l-1.451 3.571-0.514-0.733-3.122-5.355v-6.029c0-0.818-0.663-1.481-1.48-1.481h-0.74c-0.817 0-1.48 0.663-1.48 1.481v6.649c0 0.338 0.113 0.649 0.303 0.898 0.009 0.017 0.018 0.034 0.028 0.050l2.671 4.581-4.581 3.215 0.381-3.049c0.065-0.516-0.145-1.002-0.513-1.315l-4.141-5.117c-0.514-0.636-1.446-0.734-2.082-0.219l-0.575 0.466c-0.635 0.514-0.733 1.447-0.219 2.083l3.736 4.618-0.703 5.623c-0.036 0.285 0.013 0.562 0.125 0.805 0.040 0.192 0.118 0.379 0.238 0.549l2.55 3.637c0.021 0.029 0.043 0.058 0.065 0.085 0.126 0.367 0.394 0.684 0.773 0.862l6.021 2.815c0.015 0.007 0.031 0.014 0.046 0.020 0.493 0.336 1.163 0.352 1.681-0.010l5.447-3.809c0.67-0.469 0.834-1.392 0.365-2.062l-0.424-0.607c-0.468-0.67-1.391-0.834-2.061-0.366l-4.38 3.063-2.967-1.387 7.189-5.044c0.174-0.122 0.313-0.274 0.416-0.445 0.135-0.135 0.246-0.299 0.322-0.487l2.3-5.658 5.253-2.682c0.728-0.372 1.017-1.264 0.645-1.992zM8.499 27.249c0 2.071-1.679 3.75-3.75 3.75s-3.75-1.679-3.75-3.75c0-2.071 1.679-3.75 3.75-3.75s3.75 1.679 3.75 3.75z"
                stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round">
              </path>
            </svg>

            <span class="mx-4 text-sm font-medium"> Fall Risk </span>
            <span class="flex-grow text-right"> </span>
          </a>

          <a class="border-l-4 border-l-transparent flex items-center p-2 my-2 transition-colors duration-200" :class="{
            'border-l-white bg-[#3f51b5] text-white': activeSection === 'dr-consult',
            'text-gray-500 hover:bg-[#3f51b5] hover:text-white': activeSection !== 'dr-consult'
          }" @click="setActiveSection('dr-consult')" href="#">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15.6159 9.07417C16.9525 9.38026 18.2842 8.54482 18.5903 7.20817C18.8964 5.87153 18.0609 4.53983 16.7243 4.23375C15.3876 3.92766 14.0559 4.7631 13.7499 6.09975C13.4438 7.43639 14.2792 8.76809 15.6159 9.07417Z"
                stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M2.48468 2.36606H0.92218V7.49999C0.92218 10.0395 2.98087 12.0982 5.5204 12.0982C8.05991 12.0982 10.1186 10.0395 10.1186 7.49999V2.36606H8.55611"
                stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M5.60968 12.1428V13.8682C5.60968 16.7863 7.97521 19.1517 10.8932 19.1517C13.8113 19.1517 16.1767 16.7863 16.1767 13.8682V9.41962"
                stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <span class="mx-4 text-sm font-medium"> Doctor's Consult </span>
            <span class="flex-grow text-right"> </span>
          </a>

          <a class="border-l-4 border-l-transparent flex items-center p-2 my-2 transition-colors duration-200" :class="{
            'border-l-white bg-[#3f51b5] text-white': activeSection === 'add-new-visit',
            'text-gray-500 hover:bg-[#3f51b5] hover:text-white': activeSection !== 'add-new-visit'
          }" @click="setActiveSection('add-new-visit')" href="#" v-if="!isAdd">

            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>

            <span class="mx-4 text-sm font-medium text-white"> Add New Visit </span>
            <span class="flex-grow text-right"> </span>
          </a>

          <a class="border-l-4 border-l-transparent flex hover:cursor-pointer items-center p-2 my-2 transition-colors duration-200 text-gray-500 hover:bg-[#3f51b5] hover:text-white"
            v-if="!isAdd" @click="tryDeleteVisit">

            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17"
                  stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </g>
            </svg>

            <span class="mx-4 text-sm font-medium text-white"> Delete This Visit </span>
            <span class="flex-grow text-right"> </span>
          </a>
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    activeSection: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: null
    },
    id: {
      type: String,
      default: null
    },
    age: {
      type: Number,
      default: null
    },
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    setActiveSection(section: string) {
      this.$emit('update:activeSection', section)
    },
    tryDeleteVisit() {
      this.$emit('openTryDeleteVisitModal')
    }
  }
})
</script>

<style></style>
