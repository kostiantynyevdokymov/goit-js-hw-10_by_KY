import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));

function inputHandler(e) {
  e.preventDefault();
  clearList();

  const form = e.target.value.trim();
  console.log(form);

  fetchCountries(form)
    .then(countries => {
      console.log(countries);
      if (form !== '') {
        if (countries.length >= 2 && countries.length <= 10) {
          // clearList();
          markupListCountries(countries);
        } else if (countries.length === 1) {
          markupCountry(countries);
          // clearList();
          // clearInfo();
        } else {
          alarmMessage();
        }
      } else {
        Notify.warning('Oops!');
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
    });
}

function markupCountry(countries) {
  console.log('countries', countries);

  const markup = countries
    .map(({ flags, capital, languages, name, population }) => {
      const lang = Object.values(languages);
      return `<div class="country-card">
        <div class="country-card-header">
          <img
            class="country-card-image"
            src="${flags.svg}"
            alt="flag ${name.common}"
            width="35px"
          />
          <span class="country-card-title">${name.common}</span></div>
          <ul class="country-card-list">
            <li class="country-card-item">
              <span class="country-card-property">Capital: </span
              ><span class="country-card-value">${capital[0]}</span>
            </li>
            <li class="country-card-item">
              <span class="country-card-property">Population: </span
              ><span class="country-card-value">${population}</span>
            </li>
            <li class="country-card-item">
              <span class="country-card-property">Languages: </span
              ><span class="country-card-value">${lang}</span>
            </li>
          </ul>        
      </div>`;
    })
    .join('');
  refs.countryInfo.innerHTML = markup;
}

function markupListCountries(countries) {
  console.log('countriesList', countries);
  // clearList();
  clearInfo();
  const markup = countries
    .map(({ flags, name }) => {
      return `<li class="country-item">
        <img
          class="country-item-img"
          src="${flags.svg}"
          alt="flag"
          width="35px"
        />
        <span class="country-item-text">${name.common}</span>
      </li>`;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}

function alarmMessage() {
  Notify.info('Too many matches found. Please enter a more specific name.');
}

function clearList() {
  refs.countryList.innerHTML = '';
}

function clearInfo() {
  refs.countryInfo.innerHTML = '';
}
