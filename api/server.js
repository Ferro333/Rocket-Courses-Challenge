const jsonServer = require('json-server');
const { v4: uuidv4 } = require('uuid');

const server = jsonServer.create();
const router = jsonServer.router('db.json');

server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

server.use(jsonServer.bodyParser);

function assignIds(course) {
  if (!course.id) course.id = uuidv4();
  if (Array.isArray(course.modules)) {
    course.modules = course.modules.map(m => ({
      id: m.id || uuidv4(), name: m.name,
      lessons: Array.isArray(m.lessons) ? m.lessons.map(l => ({ id: l.id || uuidv4(), name: l.name })) : []
    }));
  }
  return course;
}

function validate(body) {
  const errors = {};
  if (!body.name || String(body.name).trim() === '') errors.name = 'O nome do curso é obrigatório';
  if (!body.description || String(body.description).trim().length < 10) errors.description = 'A descrição deve ter ao menos 10 caracteres';
  if (!Array.isArray(body.modules) || body.modules.length === 0) {
    errors.modules = 'O curso precisa ter ao menos um módulo';
  } else {
    body.modules.forEach((m, i) => {
      if (!m.name || String(m.name).trim() === '') errors[`modules[${i}].name`] = 'Nome do módulo obrigatório';
      if (!Array.isArray(m.lessons) || m.lessons.length === 0) errors[`modules[${i}].lessons`] = 'Cada módulo deve ter ao menos uma aula';
    });
  }
  return Object.keys(errors).length > 0 ? errors : null;
}

function errRes(res, status, message, errors) {
  return res.status(status).json({ timestamp: new Date().toISOString(), status, message, ...(errors ? { errors } : {}) });
}

server.get('/courses', (req, res) => res.json(router.db.get('courses').value()));

server.get('/courses/search', (req, res) => {
  const name = req.query.name || '';
  res.json(router.db.get('courses').filter(c => c.name.toLowerCase().includes(name.toLowerCase())).value());
});

server.get('/courses/:id', (req, res) => {
  const course = router.db.get('courses').find({ id: req.params.id }).value();
  if (!course) return errRes(res, 404, `Curso não encontrado: ${req.params.id}`);
  res.json(course);
});

server.post('/courses', (req, res) => {
  const errors = validate(req.body);
  if (errors) return errRes(res, 400, 'Erro de validação', errors);
  const course = assignIds({ ...req.body });
  router.db.get('courses').push(course).write();
  res.status(201).json(course);
});

server.put('/courses/:id', (req, res) => {
  const existing = router.db.get('courses').find({ id: req.params.id }).value();
  if (!existing) return errRes(res, 404, `Curso não encontrado: ${req.params.id}`);
  const errors = validate(req.body);
  if (errors) return errRes(res, 400, 'Erro de validação', errors);
  const updated = assignIds({ ...req.body, id: req.params.id });
  router.db.get('courses').find({ id: req.params.id }).assign(updated).write();
  res.json(updated);
});

server.delete('/courses/:id', (req, res) => {
  if (!router.db.get('courses').find({ id: req.params.id }).value()) return errRes(res, 404, 'Curso não encontrado');
  router.db.get('courses').remove({ id: req.params.id }).write();
  res.status(204).send();
});

server.listen(3000, () => console.log('\n🚀 API rodando em http://localhost:3000\n'));
