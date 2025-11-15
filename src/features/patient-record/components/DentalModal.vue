<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Dental</h1>
      <br />

      <!-- cleanTeethFreq -->
      <div class="flex flex-row w-full mt-5">
        <div>
          <label for="cleanTeethFreq" class="mb-1 block text-sm font-medium text-dark">
            Oral hygiene:
            How many days per week do you brush your teeth with fluoride toothpaste twice a day?
            <span class="req">*</span>
          </label>
          <div class="relative z-20 w-64 md:w-80 text-left"> <!-- optional: ensure wrapper isn't centering -->
            <select
              v-model="cleanTeethFreq"
              :disabled="!isEditing"
              class="w-full appearance-none rounded-md border border-stroke bg-transparent
                    py-1.5 pl-3 pr-10 !text-left [text-align-last:left] text-dark-6
                    outline-none transition focus:border-primary active:border-primary
                    disabled:cursor-default disabled:bg-gray-200"
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
            Diet: On average, how many times daily do you consume starch or sugar (food or drinks) between meals?
            <span class="req">*</span>
          </label>
          <div class="relative z-20 w-64 md:w-80 text-left"> <!-- optional: ensure wrapper isn't centering -->
            <select
              v-model="sugarConsumeFreq"
              :disabled="!isEditing"
              class="w-full appearance-none rounded-md border border-stroke bg-transparent
                    py-1.5 pl-3 pr-10 !text-left [text-align-last:left] text-dark-6
                    outline-none transition focus:border-primary active:border-primary
                    disabled:cursor-default disabled:bg-gray-200"
            >
              <option :value="'<1'">&lt;1</option>
              <option :value="'2-3'">2-3</option>
              <option :value="'4-5'">4-5</option>
              <option :value="'≥6'">≥6</option>
            </select>
            <span class="absolute top-1/2 right-4 z-10 -translate-y-1/2">
              <img src="@/assets/chevrondown.svg" height="20" width="20" />
            </span>
          </div>
        </div>
      </div>

      <!-- bacterialExposure -->
      <div class="flex flex-col mt-4">
        <div class="font-medium text-sm">
          Bacterial exposure: Has anyone in the immediate family (including a caregiver)
          had tooth decay or lost a tooth from tooth decay in the past year?<span class="req">*</span>
        </div>

        <!-- Yes / No -->
        <div class="mt-3 flex items-start gap-8">
          <label class="flex flex-col items-center text-sm">
            <span>Yes</span>
            <input
              class="mt-1 h-5 w-5"
              type="radio"
              name="bacterialExposure"
              v-model="bacterialExposure"
              :value="true"
              :disabled="!isEditing"
            />
          </label>

          <label class="flex flex-col items-center text-sm">
            <span>No</span>
            <input
              class="mt-1 h-5 w-5"
              type="radio"
              name="bacterialExposure"
              v-model="bacterialExposure"
              :value="false"
              :disabled="!isEditing"
            />
          </label>
        </div>

        <!-- Subquestion appears only when Yes -->
        <div v-if="bacterialExposure === true" class="mt-3 flex items-center gap-3">
          <label for="bact-exp-count" class="text-sm">If yes, how many people?</label>
          <input
            id="bact-exp-count"
            type="number"
            min="1"
            step="1"
            v-model.number="numLossFromToothDecay"
            :disabled="!isEditing"
            class="w-24 bg-transparent rounded-md border border-stroke py-1.5 px-3 text-sm outline-none transition
                  focus:border-primary disabled:cursor-default disabled:bg-gray-200"
            placeholder="e.g. 2"
          />
        </div>
      </div>


      <!-- oralSymptoms -->
      <div class="flex flex-col mt-5">
        <div class="font-medium text-sm">
          Oral symptoms: Do you have tooth pain or bleeding gums when you brush your teeth? <span class="req">*</span>
        </div>
        <div class="mt-3 flex items-start gap-8">
          <label class="flex flex-col items-center text-sm">
            <span>Yes</span>
            <input
              class="mt-1 h-5 w-5"
              type="radio"
              name="oralSymptoms"
              v-model="oralSymptoms"
              :value="true"
              :disabled="!isEditing"
            />
          </label>

          <label class="flex flex-col items-center text-sm">
            <span>No</span>
            <input
              class="mt-1 h-5 w-5"
              type="radio"
              name="oralSymptoms"
              v-model="oralSymptoms"
              :value="false"
              :disabled="!isEditing"
            />
          </label>
        </div>
      </div>

      <!-- drinkOtherWater -->
      <div class="flex flex-col mt-5">
        <div class="font-medium text-sm">
          Do you wake up to drink anything other than water throughout the night? <span class="req">*</span>
        </div>
        <div class="mt-3 flex items-start gap-8">
          <label class="flex flex-col items-center text-sm">
            <span>Yes</span>
            <input
              class="mt-1 h-5 w-5"
              type="radio"
              name="drinkOtherWater"
              v-model="drinkOtherWater"
              :value="true"
              :disabled="!isEditing"
            />
          </label>

          <label class="flex flex-col items-center text-sm">
            <span>No</span>
            <input
              class="mt-1 h-5 w-5"
              type="radio"
              name="drinkOtherWater"
              v-model="drinkOtherWater"
              :value="false"
              :disabled="!isEditing"
            />
          </label>
        </div>
      </div>

      <!-- riskForDentalCarries -->
      <div class="flex flex-row w-full mt-5">
        <div>
          <label for="riskForDentalCarries" class="mb-1 block text-sm font-medium text-dark">
            Risk for Dental Carries
            <span class="req">*</span>
          </label>
          <div class="relative z-20 w-64 md:w-80 text-left"> <!-- optional: ensure wrapper isn't centering -->
            <select
              v-model="riskForDentalCarries"
              :disabled="!isEditing"
              class="w-full appearance-none rounded-md border border-stroke bg-transparent
                    py-1.5 pl-3 pr-10 !text-left [text-align-last:left] text-dark-6
                    outline-none transition focus:border-primary active:border-primary
                    disabled:cursor-default disabled:bg-gray-200"
            >
              <option :value="'Low Risk'">Low Risk</option>
              <option :value="'Middle Risk'">Middle Risk</option>
              <option :value="'High Risk'">High Risk</option>
            </select>

            <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <img src="@/assets/chevrondown.svg" height="20" width="20" />
            </span>
          </div>
        </div>
      </div>

      <!-- icopeDifficultyChewing -->
      <div class="flex flex-col mt-5" v-if="showIcope">
        <div class="font-medium text-sm">
          (ICOPE: 60 yo and above) Do you have difficulty chewing food? <span class="req">*</span>
        </div>

        <!-- each column: label on top, radio below -->
        <div class="mt-3 flex items-start gap-8">
          <label class="flex flex-col items-center text-sm">
            <span>Yes</span>
            <input
              class="mt-1 h-5 w-5"
              type="radio"
              name="icopeDifficultyChewing"
              v-model="icopeDifficultyChewing"
              :value="true"
              :disabled="!isEditing"
            />
          </label>

          <label class="flex flex-col items-center text-sm">
            <span>No</span>
            <input
              class="mt-1 h-5 w-5"
              type="radio"
              name="icopeDifficultyChewing"
              v-model="icopeDifficultyChewing"
              :value="false"
              :disabled="!isEditing"
            />
          </label>
        </div>
      </div>

      <!-- icopePainInMouth -->
      <div class="flex flex-col mt-5" v-if="showIcope">
        <div class="font-medium text-sm">
          (ICOPE: 60 yo and above) Do you have pain in your mouth?<span class="req">*</span>
        </div>
        <div class="mt-3 flex items-start gap-8">
          <label class="flex flex-col items-center text-sm">
            <span>Yes</span>
            <input
              class="mt-1 h-5 w-5"
              type="radio"
              name="icopePainInMouth"
              v-model="icopePainInMouth"
              :value="true"
              :disabled="!isEditing"
            />
          </label>

          <label class="flex flex-col items-center text-sm">
            <span>No</span>
            <input
              class="mt-1 h-5 w-5"
              type="radio"
              name="icopePainInMouth"
              v-model="icopePainInMouth"
              :value="false"
              :disabled="!isEditing"
            />
          </label>
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
              v-model="toothRefs.tooth11.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_11"
              class="w-4 h-4"
              v-model="toothRefs.tooth11.value"
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
              v-model="toothRefs.tooth12.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_12"
              class="w-4 h-4"
              v-model="toothRefs.tooth12.value"
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
              v-model="toothRefs.tooth13.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_13"
              class="w-4 h-4"
              v-model="toothRefs.tooth13.value"
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
              v-model="toothRefs.tooth14.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_14"
              class="w-4 h-4"
              v-model="toothRefs.tooth14.value"
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
              v-model="toothRefs.tooth15.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_15"
              class="w-4 h-4"
              v-model="toothRefs.tooth15.value"
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
              v-model="toothRefs.tooth16.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_16"
              class="w-4 h-4"
              v-model="toothRefs.tooth16.value"
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
              v-model="toothRefs.tooth17.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_17"
              class="w-4 h-4"
              v-model="toothRefs.tooth17.value"
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
              v-model="toothRefs.tooth18.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_18"
              class="w-4 h-4"
              v-model="toothRefs.tooth18.value"
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
              v-model="toothRefs.tooth41.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_41"
              class="w-4 h-4"
              v-model="toothRefs.tooth41.value"
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
              v-model="toothRefs.tooth42.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_42"
              class="w-4 h-4"
              v-model="toothRefs.tooth42.value"
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
              v-model="toothRefs.tooth43.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_43"
              class="w-4 h-4"
              v-model="toothRefs.tooth43.value"
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
              v-model="toothRefs.tooth44.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_44"
              class="w-4 h-4"
              v-model="toothRefs.tooth44.value"
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
              v-model="toothRefs.tooth45.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_45"
              class="w-4 h-4"
              v-model="toothRefs.tooth45.value"
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
              v-model="toothRefs.tooth46.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_46"
              class="w-4 h-4"
              v-model="toothRefs.tooth46.value"
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
              v-model="toothRefs.tooth47.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_47"
              class="w-4 h-4"
              v-model="toothRefs.tooth47.value"
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
              v-model="toothRefs.tooth48.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_48"
              class="w-4 h-4"
              v-model="toothRefs.tooth48.value"
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
              v-model="toothRefs.tooth21.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_21"
              class="w-4 h-4"
              v-model="toothRefs.tooth21.value"
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
              v-model="toothRefs.tooth22.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_22"
              class="w-4 h-4"
              v-model="toothRefs.tooth22.value"
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
              v-model="toothRefs.tooth23.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_23"
              class="w-4 h-4"
              v-model="toothRefs.tooth23.value"
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
              v-model="toothRefs.tooth24.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_24"
              class="w-4 h-4"
              v-model="toothRefs.tooth24.value"
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
              v-model="toothRefs.tooth25.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_25"
              class="w-4 h-4"
              v-model="toothRefs.tooth25.value"
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
              v-model="toothRefs.tooth26.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_26"
              class="w-4 h-4"
              v-model="toothRefs.tooth26.value"
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
              v-model="toothRefs.tooth27.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_27"
              class="w-4 h-4"
              v-model="toothRefs.tooth27.value"
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
              v-model="toothRefs.tooth28.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_28"
              class="w-4 h-4"
              v-model="toothRefs.tooth28.value"
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
              v-model="toothRefs.tooth31.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_31"
              class="w-4 h-4"
              v-model="toothRefs.tooth31.value"
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
              v-model="toothRefs.tooth32.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_32"
              class="w-4 h-4"
              v-model="toothRefs.tooth32.value"
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
              v-model="toothRefs.tooth33.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_33"
              class="w-4 h-4"
              v-model="toothRefs.tooth33.value"
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
              v-model="toothRefs.tooth34.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_34"
              class="w-4 h-4"
              v-model="toothRefs.tooth34.value"
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
              v-model="toothRefs.tooth35.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_35"
              class="w-4 h-4"
              v-model="toothRefs.tooth35.value"
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
              v-model="toothRefs.tooth36.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_36"
              class="w-4 h-4"
              v-model="toothRefs.tooth36.value"
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
              v-model="toothRefs.tooth37.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_37"
              class="w-4 h-4"
              v-model="toothRefs.tooth37.value"
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
              v-model="toothRefs.tooth38.value"
              :value="true"
              :disabled="!isEditing"
            />
          </div>
          <div>
            <input
              type="radio"
              name="tooth_38"
              class="w-4 h-4"
              v-model="toothRefs.tooth38.value"
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
      <div class="flex flex-row-reverse w-full mt-5 gap-3" v-if="isEditing && !isAdd">
        <button
          @click="submitData"
          class="px-5 py-2 transition ease-in duration-200 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5] focus:outline-none"
        >
          Save Edits
        </button>
        <button
          type="button"
          @click="discardEdit"
          class="px-5 py-2 transition ease-in duration-200 rounded-lg text-sm text-red-600 hover:bg-red-600 hover:text-white border-2 border-red-600 focus:outline-none"
        >
          Discard Changes
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
import { ref, watch, computed, type Ref } from 'vue'
import { useEditableSection, bindRef } from '@features/patient-record/composables/useEditableSection'

const props = defineProps<{
  patientId?: string
  patientData?: Patient
  age: number | null
  isAdd?: boolean
  patientVid?: string
}>()

const toast = useToast()

const cleanTeethFreq = ref<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | null>(null)
const sugarConsumeFreq = ref<'<1' | '2-3' | '4-5' | '≥6' | null> (null)
const bacterialExposure = ref<boolean | null>(null)
const numLossFromToothDecay = ref<number>(0)
const oralSymptoms = ref<boolean | null>(null)
const drinkOtherWater = ref<boolean | null>(null)

const riskForDentalCarries = ref<'Low Risk' | 'Middle Risk' | 'High Risk' | null>(null)

const showIcope = computed<boolean>(() => 
  props.age != null ? props.age >= 60 : true
);

const icopeDifficultyChewing = ref<boolean | null>(null)
const icopePainInMouth = ref<boolean | null>(null)

const dentalNotes = ref<string | null>('')
const referralNeeded = ref<boolean | null>(null)
const referralLoc = ref<string | null>('')
const teeth = Array.from({ length: 48 }, () => ref<boolean | null>(null))
const toothRefs: Record<string, (typeof teeth)[0]> = {}

const draftFields: Array<ReturnType<typeof bindRef>> = [
  bindRef('cleanTeethFreq', cleanTeethFreq),
  bindRef('sugarConsumeFreq', sugarConsumeFreq),
  bindRef('bacterialExposure', bacterialExposure),
  bindRef('numLossFromToothDecay', numLossFromToothDecay),
  bindRef('oralSymptoms', oralSymptoms),
  bindRef('drinkOtherWater', drinkOtherWater),
  bindRef('riskForDentalCarries', riskForDentalCarries),
  bindRef('icopeDifficultyChewing', icopeDifficultyChewing),
  bindRef('icopePainInMouth', icopePainInMouth),
  bindRef('dentalNotes', dentalNotes),
  bindRef('referralNeeded', referralNeeded),
  bindRef('referralLoc', referralLoc),
]

for (let quadrant = 1; quadrant <= 4; quadrant++) {
  for (let position = 1; position <= 8; position++) {
    const toothKey = `tooth${quadrant}${position}`
    const toothRef = teeth[(quadrant - 1) * 8 + (position - 1)]
    toothRefs[toothKey] = toothRef
    draftFields.push(bindRef(toothKey, toothRef))
  }
}

const dentalDraftStorageKey = computed(() => {
  if (!props.patientId || !props.patientVid) return null
  return `patient-record:draft:${props.patientId}:${props.patientVid}:dental`
})

const { isEditing, toggleEdit, save, discardChanges, restoreDraft, draftStorageKey } = useEditableSection<Dental>({
  draft: {
    key: dentalDraftStorageKey,
    fields: draftFields,
    autoRestore: false
  }
})

const initialized = ref(false)
const draftRestored = ref(false)

watch(
  () => draftStorageKey.value,
  () => {
    if (draftRestored.value) return
    if (props.isAdd) return
    // Try to restore draft when storage key becomes available
    // This happens before initialization completes
    draftRestored.value = restoreDraft() || draftRestored.value
  },
  { immediate: true }
)

function initialize(patientData: Patient | undefined) {
  // Don't re-initialize if already initialized, in add mode, or currently editing
  // This prevents overwriting form values with stale data after saving

  if (initialized.value || props.isAdd || isEditing.value) return
  
  // Wait for patientData to actually be loaded (not null/undefined)
  // This prevents initializing with null data on page refresh
  if (!patientData) return

  const dental = patientData.dental
  if (!dental) {
    // No saved dental data - try to restore draft if available
    initialized.value = true
    if (!draftRestored.value) {
      draftRestored.value = restoreDraft() || draftRestored.value
    }
    return
  }

  // If we have saved data, load it and don't restore draft (draft would overwrite saved data)
  cleanTeethFreq.value = dental.cleanTeethFreq
  sugarConsumeFreq.value = dental.sugarConsumeFreq
  bacterialExposure.value = dental.bacterialExposure
  numLossFromToothDecay.value = dental.numLossFromToothDecay
  oralSymptoms.value = dental.oralSymptoms
  drinkOtherWater.value = dental.drinkOtherWater

  riskForDentalCarries.value = dental.riskForDentalCarries

  icopeDifficultyChewing.value = dental.icopeDifficultyChewing
  icopePainInMouth.value = dental.icopePainInMouth

  dentalNotes.value = dental.dentalNotes
  referralNeeded.value = dental.referralNeeded
  referralLoc.value = dental.referralLoc
  Object.keys(toothRefs).forEach((key) => {
    toothRefs[key].value = dental[key as keyof Dental] as boolean | null
  })
  initialized.value = true
  // Don't restore draft when we have saved data - it would overwrite it
  draftRestored.value = true
}

function resetData() {
  initialized.value = false
  if (!props.patientData?.dental) {
    cleanTeethFreq.value = null
    sugarConsumeFreq.value = null
    bacterialExposure.value = null
    numLossFromToothDecay.value = 0
    oralSymptoms.value = null
    drinkOtherWater.value = null

    riskForDentalCarries.value = null

    icopeDifficultyChewing.value = null
    icopePainInMouth.value = null

    dentalNotes.value = null
    referralNeeded.value = null
    referralLoc.value = null
    Object.keys(toothRefs).forEach((key) => {
      toothRefs[key].value = null
    })
    initialized.value = true
    // Try to restore draft if available
    if (!draftRestored.value) {
      draftRestored.value = restoreDraft() || draftRestored.value
    }
    return 
  }
  initialize(props.patientData)
}

// Initialize once
watch(
  () => props.patientData,
  (newVal) => initialize(newVal),
  { immediate: true }
)

const requiredFlags = computed(() => [
  cleanTeethFreq.value,
  sugarConsumeFreq.value,
  bacterialExposure.value,
  numLossFromToothDecay.value,
  oralSymptoms.value,
  drinkOtherWater.value,
  riskForDentalCarries.value,
  referralNeeded.value,
])

function buildPayload(): Dental | null {
  if (
    requiredFlags.value.some((v) => v === null) ||
    cleanTeethFreq.value === null ||
    sugarConsumeFreq.value === null ||
    showIcope.value && (icopeDifficultyChewing.value === null || icopePainInMouth.value === null)
  ) {
    toast.error('Please fill in all required fields.')
    return null
  }
  return {

    cleanTeethFreq: cleanTeethFreq.value,
    sugarConsumeFreq: sugarConsumeFreq.value,
    bacterialExposure: bacterialExposure.value!,
    numLossFromToothDecay: numLossFromToothDecay.value,
    oralSymptoms: oralSymptoms.value!,
    drinkOtherWater: drinkOtherWater.value!,

    riskForDentalCarries: riskForDentalCarries.value!,

    icopeDifficultyChewing: icopeDifficultyChewing.value!,
    icopePainInMouth: icopePainInMouth.value!,

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
    onSuccess: () => {
      toast.success('Dental saved successfully!')
      // After saving, the form already has the correct values in memory
      // We don't need to reload from parent - the form state is the source of truth
      // The initialized flag prevents re-initialization from stale patientData
    }
  })
}

function discardEdit() {
  discardChanges({
    onDiscard: () => {
      resetData()
    },
    onSuccess: () => {
      toast.info('Changes discarded.')
    }
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
