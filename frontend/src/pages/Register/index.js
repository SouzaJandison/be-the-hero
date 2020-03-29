import React, {useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Modal from 'react-modal';

import InputMask from "react-input-mask";
import cepPromise from "cep-promise";

import api from '../../services/api'

import './styles.css';

import { FiArrowLeft } from 'react-icons/fi';

import logoImg from '../../assets/logo.svg';

export default function Register(){
    const customStyles = {
        content : {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            width: 600,
            height: 150,
            fontSize: 18,
            marginRight: '-50%',
            color: '#e02041',
            transform: 'translate(-50%, -50%)'
        },
        spanText: {
            padding: 10,
        }
    };
    const [modalIsOpen,setIsOpen] = useState(false);
    const [modalText, setModalText] = useState({
        msgGmail: '',
        msgId: ''
    });
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [cep, setCep] = useState('');
    const [city, setCity] = useState('');
    const [uf, setUf] = useState('');
    const [neighborhood, setNeighborhood] = useState('');

    const [registerErr, setRegisterErr] = useState('');
    const [cepErr, setCepErr] = useState('');

    const [disabledCity, setDisabledCity] = useState(false);
    const [disabledUf, setDisabledUf] = useState(false);
    const [disabledNeighborhood, setDisabledNeighborhood] = useState(false);

    const history = useHistory();
    
    function closeModal(){
        setIsOpen(false);
        history.push('/');
    }

    async function handlerRegister(e) {
        e.preventDefault();
        setRegisterErr('');

        const data = {
            name,
            email,
            whatsapp,
            cep,
            city,
            uf,
            neighborhood,
        }

        try {
            const response = await api.post('ongs', data);
            setIsOpen(true);
            setModalText({
                msgGmail: response.data.status,
                msgId: response.data.id
            })

        } catch (err) {
            setRegisterErr('Erro no Cadastro tente novamente');
        }
    }

    async function getCep(cep) {
        setCepErr('');
        try {
            const cepInfo = await cepPromise(cep);

            setCity(cepInfo.city);
            setUf(cepInfo.state);
            setNeighborhood(cepInfo.neighborhood);

            setDisabledCity(true);
            setDisabledUf(true);
            setDisabledNeighborhood(true);
        } catch(err) {
            setCepErr('É necessário informar um CEP válido. Tente novamente');

            setCity('');
            setUf('');
            setNeighborhood('');

            setDisabledCity(false);
            setDisabledUf(false);
            setDisabledNeighborhood(false);
        }
    }

    return (
        <div className="register-container">
            <div className="content">
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <span style={customStyles.spanText}>{modalText.msgGmail}</span>
                    <span>{modalText.msgId}</span>
                </Modal>
                <section>
                    <img src={logoImg} alt="Be The Hero"/>
                    <h1>Cadastro</h1>
                    <p>Faça seu cadastro, entre na plataforma e ajude pessoas a encontrarem os casos de sua ONG.</p>
                    <Link to="/" className="back-link">
                        <FiArrowLeft size={16} color="#e02041" />
                        Volta para o logon
                    </Link>
                </section>
                <form onSubmit={handlerRegister}>
                    <span>{registerErr}</span>
                    <input 
                        placeholder="Nome da ONG"
                        value={name}
                        onChange={ e => setName(e.target.value)}
                    />
                    <input 
                        type="email" 
                        placeholder="E-mail"
                        value={email}
                        onChange={ e => setEmail(e.target.value)}
                    />
                    <InputMask
                        placeholder="Whatsapp"
                        mask="(99) 99999-9999"
                        value={whatsapp}
                        onChange={ e => setWhatsapp(e.target.value)}
                    />
                    <InputMask 
                        placeholder="Digite seu CEP"
                        mask="99999-999"
                        value={cep}
                        onChange={ e => setCep(e.target.value)}
                        onBlur={ e => getCep(e.target.value)}
                    />
                    <span>{cepErr}</span>
                    <div className="input-group">
                        <input 
                            placeholder="Cidade"
                            value={city}
                            onChange={ e => setCity(e.target.value)}
                            disabled= {disabledCity}
                        />
                        <input 
                            placeholder="UF" 
                            maxLength="2"
                            style={ {width: 80, textTransform: 'uppercase'} }
                            value={uf}
                            onChange={ e => setUf(e.target.value)}
                            disabled={disabledUf}
                        />
                    </div>
                    <input 
                        placeholder="Bairro"
                        value={neighborhood}
                        onChange={ e => setNeighborhood(e.target.value)}
                        disabled={disabledNeighborhood}
                    />
                    <button type="submit" className="button">Cadastrar</button>
                </form>
            </div>
        </div>
    );
}