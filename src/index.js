import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const searchInput = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

function countriesList(array) {
  return array
    .map((e) => {
      return `<li class="listCountry"><img height="30" src=${e.flags.svg}> <p class="nameCountry">${e.name.official}</p></li>`;
    })
    .join('');
}

function countryCard(event) {
  return ` <div class="cardCountry"><img height="50" src=${event.flags.svg}><p class="nameCard">${event.name.official}</p><p class="textCard"><span> capital: </span> ${event.capital}</p><p class="textCard"><span>population:</span> ${event.population}</p><p class="textard"><span>languages:</span> ${Object.values(event.languages).join(', ')}</p></div> `;
}

searchInput.addEventListener(
  'input',
  debounce((event) => {
    const searchQuery = event.target.value.trim();

    if (searchQuery.length === 0) {
      countryInfoEl.innerHTML = '';
      return;
    }

    fetchCountries(searchQuery)
      .then((data) => {
        if (data.length > 10) {
          Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
          countryInfoEl.innerHTML = '';
        } else if (data.length === 1) {
          countryInfoEl.innerHTML = countryCard(data[0]);
        } else {
          countryInfoEl.innerHTML = countriesList(data);
        }
      })
        .catch((error) => {
            Notiflix.Notify.failure('Oops, there is no country with that name');
            return [];
      });
  }, DEBOUNCE_DELAY)
);

