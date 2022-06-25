import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from './js/refs';
const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;


refs.input.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));

function inputHandler (event) {
    event.preventDefault();
    clearList();

    const form = event.target.value.trim();
    console.log(form);

    fetchCountries(form).then(countries => {
        console.log(countries);
        if (form !== '') {
            if (countries.length >= 2 && countries.length <= 10) {
                markupListCountry(countries);
            } else if (countries.length === 1) {
                markupCountry(countries);
            } else {
                alarmMessage();
            }
        }
            else {
            Notify.warning('min 2 and max 10 letter!')
        }
    })
        .catch(error => {
            Notify.failure('Oops, there is no country with that name');
        });
}

function markupCountry(countries) {
    console.log('countries', countries);

    const markup = countries
        .map(({ name, capital, population, flags, languages }) => {
            const lang = Object.values(languages);
            return `<div class="country-list">
  <div class="country-card-header">
    <img class="country-card-image"
    src = "${flags.svg}"
    alt = "${name.common}"
    width = "35px"
    />
    <span class="country-card-title">${name.common}</span>
  </div>
  <ul class="country-card-list">
    <li class="country-card-property"><span class="country-card-item">Capital:</span><span class="country-card-value">${capital[0]}</span></li>
    <li class="country-card-property"><span class="country-card-item">Population:</span><span class="country-card-value">${population}</span></li>
    <li class="country-card-property"><span class="country-card-item">Languages:</span><span class="country-card-value">${lang}</span></li>
  </ul>
</div>`;
        })
        .join();
    refs.countryInfo.innerHTML = markup;
}


function markupListCountry(countries) {
    console.log('countries', countries);
    clearInfo();
    const markup = countries
        .map(({ flags, name }) => {
            return `<li class="country-card-item">
  <img src="${flags.svg}" alt="flags" width="35px">
  <span class="country-item-text">${name.common}</span>
</li>`;
        })
        .join();
    refs.countryList.innerHTML = markup;
}

function alarmMessage() {
    Notify.info(`Too many matches found. Please enter a more specific name.`);
}

function clearList() {
    refs.countryList.innerHTML = '';
}

function clearInfo() {
    refs.countryInfo.innerHTML = '';
}