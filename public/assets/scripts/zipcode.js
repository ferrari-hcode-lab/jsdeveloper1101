import axios from 'axios';
import IMask from 'imask'
import { setFormValues } from './utils';

document.querySelectorAll('.zipcode').forEach(zipcode => {

    const page = zipcode.closest('.page')
    const formElement = page.querySelector('form')
    const zipcodeElement = page.querySelector('#zipcode');
    const btnZipcodeElement = page.querySelector('#btn-search');
    const numberElement = page.querySelector('#number');

    new IMask(zipcodeElement, {
        mask: '00000-000'
    })

    const searchZipcode = () => {
        const { value } = zipcodeElement;

        btnZipcodeElement.disabled = true;
        btnZipcodeElement.innerHTML = 'Buscando...'

        axios({
            url: `https://viacep.com.br/ws/${value.replace('-', '')}/json/`
        }).then( ({data}) => {

            setFormValues(formElement,{
                address: data.logradouro,
                complement: data.complemento,
                district: data.bairro,
                city: data.localidade,
                state: data.uf,
                country: 'Brasil'
            })

            numberElement.focus()

        }).finally(() => {
            btnZipcodeElement.disabled = false;
            btnZipcodeElement.innerHTML = 'Buscar'
        })
    }

    zipcodeElement.addEventListener('keyup', e => {

        if(e.key === 'Enter') {
            searchZipcode()
        } else if(e.target.value.length > 8) {
            searchZipcode()
        }

    })

    btnZipcodeElement.addEventListener('click', e => searchZipcode)

    formElement.addEventListener('submit', e => {
        e.preventDefault();
    })
})