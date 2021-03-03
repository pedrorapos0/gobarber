# Recuperação de senha

**RF (Requisitos funcionais, macro funções da aplicação)**

- O usuário deve poder recuperar sua senha informando o seu e-mail;
- O usuário deve receber um e-mail com instruções para recuperação de senha;
- O usuário deve poder resetar a senha;

**RNF (Requisitos Não Funcionais, parte tecnica, ex: qual biblioteca será usuada...)**

- Utilizar o Mailtrap para testar os envios e, ambientes de dev;
- Utilizar Amazon SES para envio em produção;
- O envio de e-mails deve acontecer em segundo plano (backgroud job);

**RN (Regras de Negocios, são as lógicas do negócio que está sendo implantado )**

- O link enviado por e-mail para resetar senha, deve expirar em 2h;
- O usuário precisa confirmar a nova senha ao resetar a sua senha;

# Atualização do perfil

**RF**
 - O usuário deve poder atualizar o seu nome, e-mail, senha e avatar;


**RNF**

**RN**

- O usúario não pode alterar seu e-mail para um e-mail já utilizado;
- Para atualizar sua senha, o usúario deve informar a senha antiga;
- Para atualizar a senha, o usuário precisa confirmar a nova senha;

# Painel do prestador

**RF**

- O usúario deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber um notificação sempre que houver um novo agendamento;
- O prestador deve poder vizualisar as notificações não lidas;

**RNF**
- Os Agendamentos do prestador no dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo-real utilizando Socket.oi

**RN**

- A notificação deve ter um status de lida ou não-lida para que o prestador possa controlar;

# Agendamento de serviços

**RF**
- O usúario deve poder listar todos prestadores de serviços cadastrados;
- O usúario deve poder listar os dias de um mês com pelo menos um hórario disponível de um prestador;
- O usúario deve poder listar hórarios disponíveis em um dia específico de um prestador;
- O usúario deve poder realizar um novo agendamento com um prestador;

**RNF**

- A listagem de prestadores deve ser armazenada em cache;

**RN**

- Cada agendamento deve durar 1h exatamente;
- Os agendamentos devem estar disponíveis entre 8h ás 18h (Primeiro ás 8h, último às 17h);
- O usúario não pode agendar em um hórario já ocupado;
- O usúario não pode agendar em um horário que já passou;
- O prestador não pode agendar serviços consigo mesmo;
