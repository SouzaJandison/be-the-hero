const nodemailer = require('nodemailer');
const connection = require('../database/connection');

const generateUniqueId = require('../utils/generateUniqueId');

module.exports = {
  async index(request, response) {
    const ongs = await connection('ongs').select('*');
    return response.json(ongs);
  },

  // eslint-disable-next-line consistent-return
  async create(request, response) {
    const {
      name, email, whatsapp, cep, city, uf, neighborhood,
    } = request.body;
    const id = generateUniqueId();

    try {
      await connection('ongs').insert({
        id,
        name,
        email,
        whatsapp,
        cep,
        city,
        uf,
        neighborhood,
      });

      try {
        const user = 'testeemailnode@gmail.com';
        const password = 'rootnode456789';

        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          auth: {
            user,
            password,
          },
        });

        const mailOptions = {
          from: user,
          to: email,
          subject: 'Seu ID de acesso ao Be The Hero',
          text: `ID: ${id}`,
        };

        transporter.sendMail(mailOptions, (error, _) => {
          if (error) {
            console.log(error);
            return response.json({ status: 'Erro!!!' });
          }
          return response.json({
            status: 'ID de acesso enviando para seu e-mail! verifique seu e-mail',
            id: `Ou pegue aqui mesmo (${id})`,
          });
        });
      } catch (err) {
        return response.json({ id });
      }
    } catch (err) {
      console.log(err);
    }
  },
};
