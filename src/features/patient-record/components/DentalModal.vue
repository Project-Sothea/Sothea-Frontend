<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Dental</h1>
      <br />

      <!-- pastYearDecay -->
      <div class="flex flex-col mt-4">
        <div class="font-medium text-sm">
          Bacterial Exposure Question: Has anyone in the immediate family (including a caregiver)
          had tooth decay or lost a tooth from tooth decay in the past year?
          <span class="req">*</span>
        </div>
        <div class="flex flex-col items-start mt-2 space-y-2">
          <label>
            <input
              type="radio"
              name="pastYearDecay"
              v-model="pastYearDecay"
              :value="true"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">True</span>
          </label>

          <label>
            <input
              type="radio"
              name="pastYearDecay"
              v-model="pastYearDecay"
              :value="false"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">False</span>
          </label>
        </div>
      </div>

      <!-- brushTeethPain -->
      <div class="flex flex-col mt-4">
        <div class="font-medium text-sm">
          Oral Symptoms Question: Does your child complain of tooth pain or bleeding gums when they
          brush their teeth? <span class="req">*</span>
        </div>
        <div class="flex flex-col items-start mt-2 space-y-2">
          <label>
            <input
              type="radio"
              name="brushTeethPain"
              v-model="brushTeethPain"
              :value="true"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">True</span>
          </label>
          <label>
            <input
              type="radio"
              name="brushTeethPain"
              v-model="brushTeethPain"
              :value="false"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">False</span>
          </label>
        </div>
      </div>

      <!-- drinkOtherWater -->
      <div class="flex flex-col mt-5">
        <div class="font-medium text-sm">
          Oral Hygiene Question: Does your child wake up to drink anything other than water
          throughout the night? <span class="req">*</span>
        </div>
        <div class="flex flex-col items-start mt-5 space-y-2">
          <label>
            <input
              type="radio"
              name="drinkOtherWater"
              v-model="drinkOtherWater"
              :value="true"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">True</span>
          </label>

          <label>
            <input
              type="radio"
              name="drinkOtherWater"
              v-model="drinkOtherWater"
              :value="false"
              :disabled="!isEditing"
            />
            <span class="ml-2 text-sm">False</span>
          </label>
        </div>
      </div>

      <!-- cleanTeethFreq -->
      <div class="flex flex-row w-full mt-5">
        <div>
          <label for="cleanTeethFreq" class="mb-1 block text-sm font-medium text-dark">
            How many days per week do you clean your child's teeth or supervise / monitor them brush
            with fluoride toothpaste twice a day? <span class="req">*</span>
          </label>
          <div class="relative z-20 w-1/5">
            <select
              v-model="cleanTeethFreq"
              :disabled="!isEditing"
              class="relative z-20 w-full appearance-none rounded-md border border-stroke bg-transparent py-1.5 pl-12 pr-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
            >
              <option :value="0">0</option>
              <option :value="1">1</option>
              <option :value="2">2</option>
              <option :value="3">3</option>
              <option :value="4">4</option>
              <option :value="5">5</option>
              <option :value="6">6</option>
              <option :value="7">7</option>
            </select>
            <span class="absolute top-1/2 right-4 z-10 -translate-y-1/2">
              <img src="@/assets/chevrondown.svg" height="20" width="20" />
            </span>
          </div>
        </div>
      </div>

      <!-- sugarConsumeFreq -->
      <div class="flex flex-row w-full mt-5">
        <div>
          <label for="sugarConsumeFreq" class="mb-1 block text-sm font-medium text-dark">
            Diet Question: On average, how many times daily does your child consume starch or sugar
            (food or drinks) between meals? <span class="req">*</span>
          </label>
          <div class="relative z-20 w-1/5">
            <select
              v-model="sugarConsumeFreq"
              :disabled="!isEditing"
              class="relative z-20 w-full appearance-none rounded-md border border-stroke bg-transparent py-1.5 pl-12 pr-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
            >
              <option :value="0">0</option>
              <option :value="1">1</option>
              <option :value="2">2</option>
              <option :value="3">3</option>
              <option :value="4">4</option>
              <option :value="5">5</option>
              <option :value="6">6</option>
            </select>
            <span class="absolute top-1/2 right-4 z-10 -translate-y-1/2">
              <img src="@/assets/chevrondown.svg" height="20" width="20" />
            </span>
          </div>
        </div>
      </div>

      <!-- Dental Notes -->
      <div class="flex flex-col mt-5">
        <div class="flex flex-row">
          <div class="font-medium text-sm pl-13">Dental Notes</div>
        </div>
        <div class="flex flex-row">
          <div class="flex pl-13 grow">
            <textarea
              v-model="dentalNotes"
              rows="1"
              placeholder="Enter dental notes"
              class="w-full bg-transparent rounded-md border border-stroke p-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
              :disabled="!isEditing"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="flex flex-col mt-5">
        <!-- Referral Header -->
        <div class="flex flex-row">
          <div class="w-1/3"></div>
          <div class="font-medium text-sm pr-5">Yes</div>
          <div class="font-medium text-sm">No</div>
          <div class="font-medium text-sm w-1/3 pl-11">Location</div>
        </div>
      </div>
      <!-- Referral Needed? -->
      <div class="flex flex-col mt-2">
        <div class="flex flex-row">
          <div class="font-normal items-center inline-flex text-sm w-1/3">
            Referral Needed? <span class="req">*</span>
          </div>

          <div class="flex">
            <div class="flex items-center pr-7">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="ref-needed"
                  class="w-4 h-4"
                  v-model="referralNeeded"
                  :value="true"
                  :disabled="!isEditing"
                />
              </label>
            </div>
            <div class="flex items-center">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="ref-needed"
                  class="w-4 h-4"
                  v-model="referralNeeded"
                  :value="false"
                  :disabled="!isEditing"
                />
              </label>
            </div>
          </div>

          <div class="flex w-1/3 pl-11 grow">
            <textarea
              v-model="referralLoc"
              rows="1"
              placeholder="Enter Location"
              class="w-full bg-transparent rounded-md border border-stroke p-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
              :disabled="!isEditing"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Tooth Chart Right Upper Header -->
      <div class="flex flex-row justify-between mt-5">
        <div class="font-normal items-center inline-flex text-sm w-1/5">Right Upper Cavities?</div>
        <div class="font-medium text-sm">11</div>
        <div class="font-medium text-sm">12</div>
        <div class="font-medium text-sm">13</div>
        <div class="font-medium text-sm">14</div>
        <div class="font-medium text-sm">15</div>
        <div class="font-medium text-sm">16</div>
        <div class="font-medium text-sm">17</div>
        <div class="font-medium text-sm">18</div>
      </div>

      <div class="flex flex-row mt-2 justify-between">
        <div class="flex flex-col w-1/5">
          <p class="text-sm font-medium mb-2">Yes</p>
          <p class="text-sm font-medium">No</p>
        </div>

        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_11"
              class="w-4 h-4"
              v-model="toothRefs.tooth11"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_11"
              class="w-4 h-4"
              v-model="toothRefs.tooth11"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>

        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_12"
              class="w-4 h-4"
              v-model="toothRefs.tooth12"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_12"
              class="w-4 h-4"
              v-model="toothRefs.tooth12"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>

        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_13"
              class="w-4 h-4"
              v-model="toothRefs.tooth13"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_13"
              class="w-4 h-4"
              v-model="toothRefs.tooth13"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>
        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_14"
              class="w-4 h-4"
              v-model="toothRefs.tooth14"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_14"
              class="w-4 h-4"
              v-model="toothRefs.tooth14"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>
        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_15"
              class="w-4 h-4"
              v-model="toothRefs.tooth15"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_15"
              class="w-4 h-4"
              v-model="toothRefs.tooth15"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>

        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_16"
              class="w-4 h-4"
              v-model="toothRefs.tooth16"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_16"
              class="w-4 h-4"
              v-model="toothRefs.tooth16"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>

        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_17"
              class="w-4 h-4"
              v-model="toothRefs.tooth17"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_17"
              class="w-4 h-4"
              v-model="toothRefs.tooth17"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>
        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_18"
              class="w-4 h-4"
              v-model="toothRefs.tooth18"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_18"
              class="w-4 h-4"
              v-model="toothRefs.tooth18"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>
      </div>

      <!-- Tooth Chart Right Lower Header -->
      <div class="flex flex-row mt-2 justify-between">
        <div class="font-normal items-center inline-flex text-sm w-1/5">Right Lower Cavities?</div>
        <div class="font-medium text-sm">41</div>
        <div class="font-medium text-sm">42</div>
        <div class="font-medium text-sm">43</div>
        <div class="font-medium text-sm">44</div>
        <div class="font-medium text-sm">45</div>
        <div class="font-medium text-sm">46</div>
        <div class="font-medium text-sm">47</div>
        <div class="font-medium text-sm">48</div>
      </div>

      <div class="flex flex-row mt-2 justify-between">
        <div class="flex flex-col w-1/5">
          <p class="text-sm font-medium mb-2">Yes</p>
          <p class="text-sm font-medium">No</p>
        </div>

        <div>
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_41"
              class="w-4 h-4"
              v-model="toothRefs.tooth41"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_41"
              class="w-4 h-4"
              v-model="toothRefs.tooth41"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>

        <div>
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_42"
              class="w-4 h-4"
              v-model="toothRefs.tooth42"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_42"
              class="w-4 h-4"
              v-model="toothRefs.tooth42"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>

        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_43"
              class="w-4 h-4"
              v-model="toothRefs.tooth43"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_43"
              class="w-4 h-4"
              v-model="toothRefs.tooth43"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>
        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_44"
              class="w-4 h-4"
              v-model="toothRefs.tooth44"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_44"
              class="w-4 h-4"
              v-model="toothRefs.tooth44"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>
        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_45"
              class="w-4 h-4"
              v-model="toothRefs.tooth45"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_45"
              class="w-4 h-4"
              v-model="toothRefs.tooth45"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>

        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_46"
              class="w-4 h-4"
              v-model="toothRefs.tooth46"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_46"
              class="w-4 h-4"
              v-model="toothRefs.tooth46"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>

        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_47"
              class="w-4 h-4"
              v-model="toothRefs.tooth47"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_47"
              class="w-4 h-4"
              v-model="toothRefs.tooth47"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>
        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_48"
              class="w-4 h-4"
              v-model="toothRefs.tooth48"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_48"
              class="w-4 h-4"
              v-model="toothRefs.tooth48"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>
      </div>

      <!-- Tooth Chart Left Upper Header -->
      <div class="flex flex-row mt-2 justify-between">
        <div class="font-normal items-center inline-flex text-sm w-1/5">Left Upper Cavities?</div>
        <div class="font-medium text-sm">21</div>
        <div class="font-medium text-sm">22</div>
        <div class="font-medium text-sm">23</div>
        <div class="font-medium text-sm">24</div>
        <div class="font-medium text-sm">25</div>
        <div class="font-medium text-sm">26</div>
        <div class="font-medium text-sm">27</div>
        <div class="font-medium text-sm">28</div>
      </div>

      <div class="flex flex-row mt-2 justify-between">
        <div class="flex flex-col w-1/5">
          <p class="text-sm font-medium mb-2">Yes</p>
          <p class="text-sm font-medium">No</p>
        </div>

        <div>
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_21"
              class="w-4 h-4"
              v-model="toothRefs.tooth21"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_21"
              class="w-4 h-4"
              v-model="toothRefs.tooth21"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>

        <div>
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_22"
              class="w-4 h-4"
              v-model="toothRefs.tooth22"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_22"
              class="w-4 h-4"
              v-model="toothRefs.tooth22"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>

        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_23"
              class="w-4 h-4"
              v-model="toothRefs.tooth23"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_23"
              class="w-4 h-4"
              v-model="toothRefs.tooth23"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>
        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_24"
              class="w-4 h-4"
              v-model="toothRefs.tooth24"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_24"
              class="w-4 h-4"
              v-model="toothRefs.tooth24"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>
        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_25"
              class="w-4 h-4"
              v-model="toothRefs.tooth25"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_25"
              class="w-4 h-4"
              v-model="toothRefs.tooth25"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>

        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_26"
              class="w-4 h-4"
              v-model="toothRefs.tooth26"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_26"
              class="w-4 h-4"
              v-model="toothRefs.tooth26"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>

        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_27"
              class="w-4 h-4"
              v-model="toothRefs.tooth27"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_27"
              class="w-4 h-4"
              v-model="toothRefs.tooth27"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>
        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_28"
              class="w-4 h-4"
              v-model="toothRefs.tooth28"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_28"
              class="w-4 h-4"
              v-model="toothRefs.tooth28"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>
      </div>

      <!-- Tooth Chart Left Lower Header -->
      <div class="flex flex-row mt-2 justify-between">
        <div class="font-normal items-center inline-flex text-sm w-1/5">Left Lower Cavities?</div>
        <div class="font-medium text-sm">31</div>
        <div class="font-medium text-sm">32</div>
        <div class="font-medium text-sm">33</div>
        <div class="font-medium text-sm">34</div>
        <div class="font-medium text-sm">35</div>
        <div class="font-medium text-sm">36</div>
        <div class="font-medium text-sm">37</div>
        <div class="font-medium text-sm">38</div>
      </div>

      <div class="flex flex-row mt-2 justify-between">
        <div class="flex flex-col w-1/5">
          <p class="text-sm font-medium mb-2">Yes</p>
          <p class="text-sm font-medium">No</p>
        </div>

        <div>
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_31"
              class="w-4 h-4"
              v-model="toothRefs.tooth31"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_31"
              class="w-4 h-4"
              v-model="toothRefs.tooth31"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>

        <div>
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_32"
              class="w-4 h-4"
              v-model="toothRefs.tooth32"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_32"
              class="w-4 h-4"
              v-model="toothRefs.tooth32"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>

        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_33"
              class="w-4 h-4"
              v-model="toothRefs.tooth33"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_33"
              class="w-4 h-4"
              v-model="toothRefs.tooth33"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>
        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_34"
              class="w-4 h-4"
              v-model="toothRefs.tooth34"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_34"
              class="w-4 h-4"
              v-model="toothRefs.tooth34"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>
        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_35"
              class="w-4 h-4"
              v-model="toothRefs.tooth35"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_35"
              class="w-4 h-4"
              v-model="toothRefs.tooth35"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>

        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_36"
              class="w-4 h-4"
              v-model="toothRefs.tooth36"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_36"
              class="w-4 h-4"
              v-model="toothRefs.tooth36"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>

        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_37"
              class="w-4 h-4"
              v-model="toothRefs.tooth37"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_37"
              class="w-4 h-4"
              v-model="toothRefs.tooth37"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>
        <div class="flex-col">
          <div class="mb-2">
            <input
              type="radio"
              name="tooth_38"
              class="w-4 h-4"
              v-model="toothRefs.tooth38"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_38"
              class="w-4 h-4"
              v-model="toothRefs.tooth38"
              :value="false"
              :disabled="!isEditing"
            />
          </div>
        </div>
      </div>

      <!-- Edit Button -->
      <div class="flex flex-row-reverse w-full mt-5">
        <button
          v-if="!isEditing && !isAdd"
          @click="toggleEdit"
          class="px-5 py-2 transition ease-in duration-200 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5] focus:outline-none"
        >
          Edit
        </button>
      </div>

      <!-- Save Edits Button -->
      <div class="flex flex-row-reverse w-full mt-5">
        <button
          v-if="isEditing && !isAdd"
          @click="submitData"
          class="px-5 py-2 transition ease-in duration-200 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5] focus:outline-none"
        >
          Save Edits
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '@features/patient-record/types/Patient'
import { updateSection } from '@features/patient-record/api/visit'
import type Dental from '@features/patient-record/types/Dental'
import { ref, watch, computed } from 'vue'
import { useEditableSection } from '@features/patient-record/composables/useEditableSection'

const props = defineProps<{
  patientId?: string
  patientData?: Patient
  isAdd?: boolean
  patientVid?: string
}>()

const toast = useToast()

const cleanTeethFreq = ref<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | null>(null)
const sugarConsumeFreq = ref<0 | 1 | 2 | 3 | 4 | 5 | 6 | null>(null)
const pastYearDecay = ref<boolean | null>(null)
const brushTeethPain = ref<boolean | null>(null)
const drinkOtherWater = ref<boolean | null>(null)
const dentalNotes = ref<string | null>('')
const referralNeeded = ref<boolean | null>(null)
const referralLoc = ref<string | null>('')
// Editing state handled by composable
const { isEditing, toggleEdit, save } = useEditableSection<Dental>()

const teeth = Array.from({ length: 48 }, () => ref<boolean | null>(null))
const toothRefs: Record<string, (typeof teeth)[0]> = {}
for (let quadrant = 1; quadrant <= 4; quadrant++) {
  for (let position = 1; position <= 8; position++) {
    const toothKey = `tooth${quadrant}${position}`
    toothRefs[toothKey] = teeth[(quadrant - 1) * 8 + (position - 1)]
  }
}

// Initialize once
let initialized = false
watch(
  () => props.patientData,
  (newVal) => {
    if (initialized || props.isAdd || !newVal?.dental) return
    const dental = newVal.dental
    cleanTeethFreq.value = dental.cleanTeethFreq
    sugarConsumeFreq.value = dental.sugarConsumeFreq
    pastYearDecay.value = dental.pastYearDecay
    brushTeethPain.value = dental.brushTeethPain
    drinkOtherWater.value = dental.drinkOtherWater
    dentalNotes.value = dental.dentalNotes
    referralNeeded.value = dental.referralNeeded
    referralLoc.value = dental.referralLoc
    Object.keys(toothRefs).forEach((key) => {
      toothRefs[key].value = dental[key as keyof Dental] as boolean | null
    })
    initialized = true
  },
  { immediate: true }
)

const requiredFlags = computed(() => [
  pastYearDecay.value,
  brushTeethPain.value,
  drinkOtherWater.value,
  referralNeeded.value
])

function buildPayload(): Dental | null {
  if (
    requiredFlags.value.some((v) => v === null) ||
    cleanTeethFreq.value === null ||
    sugarConsumeFreq.value === null
  ) {
    toast.error('Please fill in all required fields.')
    return null
  }
  return {
    cleanTeethFreq: cleanTeethFreq.value,
    sugarConsumeFreq: sugarConsumeFreq.value,
    pastYearDecay: pastYearDecay.value!,
    brushTeethPain: brushTeethPain.value!,
    drinkOtherWater: drinkOtherWater.value!,
    dentalNotes: dentalNotes.value,
    referralNeeded: referralNeeded.value!,
    referralLoc: referralLoc.value,
    tooth11: toothRefs.tooth11.value,
    tooth12: toothRefs.tooth12.value,
    tooth13: toothRefs.tooth13.value,
    tooth14: toothRefs.tooth14.value,
    tooth15: toothRefs.tooth15.value,
    tooth16: toothRefs.tooth16.value,
    tooth17: toothRefs.tooth17.value,
    tooth18: toothRefs.tooth18.value,
    tooth21: toothRefs.tooth21.value,
    tooth22: toothRefs.tooth22.value,
    tooth23: toothRefs.tooth23.value,
    tooth24: toothRefs.tooth24.value,
    tooth25: toothRefs.tooth25.value,
    tooth26: toothRefs.tooth26.value,
    tooth27: toothRefs.tooth27.value,
    tooth28: toothRefs.tooth28.value,
    tooth31: toothRefs.tooth31.value,
    tooth32: toothRefs.tooth32.value,
    tooth33: toothRefs.tooth33.value,
    tooth34: toothRefs.tooth34.value,
    tooth35: toothRefs.tooth35.value,
    tooth36: toothRefs.tooth36.value,
    tooth37: toothRefs.tooth37.value,
    tooth38: toothRefs.tooth38.value,
    tooth41: toothRefs.tooth41.value,
    tooth42: toothRefs.tooth42.value,
    tooth43: toothRefs.tooth43.value,
    tooth44: toothRefs.tooth44.value,
    tooth45: toothRefs.tooth45.value,
    tooth46: toothRefs.tooth46.value,
    tooth47: toothRefs.tooth47.value,
    tooth48: toothRefs.tooth48.value
  }
}

async function submitData() {
  if (!props.patientVid) {
    toast.error('Missing visit id')
    return
  }
  await save({
    buildPayload,
    update: () => updateSection(props.patientId!, props.patientVid!, 'dental', buildPayload()!),
    onSuccess: () => toast.success('Dental saved successfully!')
  })
}
</script>

<style scoped>
h1 {
  font-size: 1.25rem;
  font-weight: 500;
}
.req {
  color: red;
}
</style>
