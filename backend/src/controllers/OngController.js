const connection = require('../database/connection');
const genereteUniqueId = require('../utils/genereteUniqueId');

const nodemailer = require("nodemailer");

module.exports = {
    async index(request, response) {
        const ongs = await connection('ongs').select('*');
        return response.json(ongs);
    },
    
    async create(request, response) {
        const { name, email, whatsapp, cep, city, uf, neighborhood} = request.body;
        const id = genereteUniqueId();

        try {
            await connection('ongs').insert({
                id,
                name,
                email,
                whatsapp,
                cep,
                city,
                uf,
                neighborhood
            });

            try {
                const usuario = 'testeemailnode@gmail.com';
                const senha = 'rootnode456789'; 
        
                let transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    auth: {
                    user: usuario,
                    pass: senha
                    }
                });
                
                let destinatario = email;
        
                let mailOptions = {
                    from: usuario,
                    to: destinatario,
                    subject: "Seu ID de acesso ao Be The Hero",
                    text: `ID: ${id}`,
                }
        
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                        return response.json({ status: 'Erro!!!'});
                    } else {
                        return response.json({ 
                            status: `ID de acesso enviando para seu e-mail! verifique seu e-mail`,
                            id: `Ou pegue aqui mesmo (${id})`,
                        });
                    }
                });
            }catch(err) {
                return response.json({ id });
            }
        } catch(err) {
            console.log(err);
        }
    }
};