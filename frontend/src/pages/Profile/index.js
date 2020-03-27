import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';

//CSS
import "./styles.css";
//ICONs
import { FiPower, FiTrash2 } from 'react-icons/fi';
//IMGs
import logoImg from '../../assets/logo.svg';

export default function Profile() {
    const [incidents, setIncidents] = useState([]);
    const history = useHistory();
    const ongName = localStorage.getItem('orgName');
    const ongId = localStorage.getItem('ongId');
    useEffect( () => {
        api.get('profile', {
            headers: {
                Authorization: ongId,
            }
        }).then (response => {
            setIncidents(response.data);
        });
    }, [ongId] );

    async function handleDeleteIncident(id) {
        try {
            await api.delete(`incidents/${id}`, {
                headers: {
                    Authorization: ongId,
                }
            });
            setIncidents(incidents.filter( incident => incident.id !== id));
        } catch(err) {
            alert('Erro ao deleta caso, tente novamente!')
        }
    }

    function handleLogout() {
        localStorage.clear();
        history.push('/');
    }
    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be The Hero"/>
                <span>Bem vinda, {ongName}</span>

                <Link to="/incidents/new" className="button">
                    Cadastrar novo caso
                </Link>
                <button type="submit" onClick={handleLogout}>
                    <FiPower size={18} color="#e02041" />
                </button>
            </header>
            <h1>Casos Cadastrados</h1>
            <ul>
                {incidents.map(incident => (
                    <li key={incident.id}>
                        <strong>CASO:</strong>
                        <p>{incident.title}</p>
                        <strong>DESCRIÇÃO:</strong>
                        <p>{incident.description}</p>
                        <strong>VALOR:</strong>
                        <p>{
                            Intl.NumberFormat(
                                'pt-BR', 
                                { style: 'currency', currency: 'BRL'}
                            ).format(incident.value)
                        }</p>
                        <button type="submit" onClick={ () => handleDeleteIncident(incident.id)}>
                            <FiTrash2 size={20} color="#a8a8b3" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}