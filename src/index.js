import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const searchInput = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

function countriesList(array) {
  countryListEl.innerHTML = '';
  countryInfoEl.innerHTML = ''; 
  return array
    .map((e) => {
      return `<li class="listCountry"><img height="30" src=${e.flags.svg}> <p class="nameCountry">${e.name.official}</p></li>`;
    })
    .join('');
}

function countryCard(event) {
  countryListEl.innerHTML = '';
  countryInfoEl.innerHTML = ''; 
  return ` <div class="cardCountry"><img height="50" src=${event.flags.svg}><p class="nameCard">${event.name.official}</p><p class="textCard"><span> capital: </span> ${event.capital}</p><p class="textCard"><span>population:</span> ${event.population}</p><p class="textard"><span>languages:</span> ${Object.values(event.languages).join(', ')}</p></div> `;
}

searchInput.addEventListener(
  'input',
  debounce((event) => {
    const searchQuery = event.target.value.trim();

    if (searchQuery.length === 0) {
      countryInfoEl.innerHTML = '';
      countryListEl.innerHTML = ''; 
      return;
    }

    fetchCountries(searchQuery)
      .then((data) => {
        if (data.length > 10) {
          Notify.info('Too many matches found. Please enter a more specific name.');
          countryInfoEl.innerHTML = '';
          countryListEl.innerHTML = '';
          searchInput.value = '';
        } else if (data.length === 1) {
          countryInfoEl.insertAdjacentHTML('beforeend', countryCard(data[0]));
          countryListEl.innerHTML = '';
        } else {
          countryInfoEl.insertAdjacentHTML('beforeend', countriesList(data));
          countryListEl.innerHTML = '';

        }
      })
      .catch((error) => {
        Notify.failure('Oops, there is no country with that name');
        countryInfoEl.innerHTML = '';
        countryListEl.innerHTML = '';
        searchInput.value = '';
      });
  }, DEBOUNCE_DELAY)
);
