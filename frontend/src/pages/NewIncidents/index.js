import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api'

import './styles.css'

import { FiArrowLeft } from 'react-icons/fi';

import logoImg from '../../assets/logo.svg';

export default function NewIncidents() {
    const history = useHistory(); 

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [newIncidentErr, setNewIncidentErr] = useState('');

    const ongId = localStorage.getItem('ongId');

    async function hardleNewIncident(e) {
        e.preventDefault();
        const data = {
            title,
            description,
            value
        }

        try {
            setNewIncidentErr('');
            await api.post('incidents', data, {
                headers: {
                    Authorization: ongId,
                }
            });

           history.push('/profile')
        } catch(err) {
            setNewIncidentErr('Erro ao cadastra caso, tente novamente!');
        }
    }
    return(
        <div className="new-incident-container">
            <div className="content">
                <section>
                    <img src={logoImg} alt="Be The Hero"/>
                    <h1>Cadastrar novo caso</h1>
                    <p>Descreva o caso detanhadamente para encontrar um herói para resolver isso.</p>
                    <Link to="/profile" className="back-link">
                        <FiArrowLeft size={16} color="#e02041" />
                        Volta para home
                    </Link>
                </section>
                <form onSubmit={hardleNewIncident}>
                    <span>{newIncidentErr}</span>
                    <input 
                        placeholder="Título do caso"
                        value={title}
                        onChange={ e => setTitle(e.target.value)}
                    />
                    <textarea 
                        placeholder="Descrição"
                        value={description}
                        onChange={ e => setDescription(e.target.value)}
                    />
                    <input 
                        placeholder="Valor em reais"
                        value={value}
                        onChange={ e => setValue(e.target.value)}
                        type="number"
                    />
                    <button type="submit" className="button">Cadastrar</button>
                </form>
            </div>
        </div>
    );
}