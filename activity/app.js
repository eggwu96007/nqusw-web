import { Application, Router,send } from "https://deno.land/x/oak@v6.5.0/mod.ts";
import * as render from './render.js'
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Session } from "https://deno.land/x/session@1.1.0/mod.ts";
import { multiParser} from 'https://deno.land/x/multiparser@v2.1.0/mod.ts'
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT, username TEXT, body TEXT, file TEXT , content TEXT)");
db.query("CREATE TABLE IF NOT EXISTS users_student (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, email TEXT)");
db.query("CREATE TABLE IF NOT EXISTS users_teacher (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, email TEXT)");

const router = new Router();


router.get('/', list)
  .get('/stu', liststu)
  
  /*add student account*/
  .get('/addaccount', signup_stuUi)
  .post('/addaccount', signup_stu) 
  /*teacher login */
  .get('/login', loginUi)
  .post('/login', login)
  /* student login*/
  .get('/loginstu', loginUi)
  .post('/loginstu', loginstu)
  /*create post*/
  .get('/post/new', add)
  .get('/post/newstu', addstu) 
  .get('/post/:id', show)
  .post('/post', create)
  .post('/poststu', createstu)
   /*del post*/
  .get('/delpost/:id',delpost)
  /*del account*/
  .get('/delaccount/:id',delaccount)
  /*edit post*/ 
  .get('/editpost/:id',editpostui)
  .post('/:id',editpost)
  /*edit account*/ 
  .get('/editpassword/:id',editpasswordui)
  .post('/change/:id',editpassword)
  .get('/editaccount',editaccount)
  .get('/signup', signupUi)
  .post('/signup', signup)
  .get('/logout', logout)

const app = new Application();

const session = new Session({ framework: "oak" });
await session.init();
app.use(session.use()(session));
app.use(router.routes());
app.use(router.allowedMethods());
app.use(oakCors());


app.use(async (ctx) => {
  if (ctx.request.url.pathname.startsWith("/images")) {
    await send(ctx, ctx.request.url.pathname, {
      root: Deno.cwd(),
      index: "index.html",
    });  
  }
});

function sqlcmd(sql, arg1) {
  try {
    var results = db.query(sql, arg1)
    return results
  } catch (error) {
    throw error
  }
}

function postQuery(sql) {
  let list = []
  for (const [id, username, title, body,file,content] of sqlcmd(sql)) {
    list.push({id, username, title, body,file,content})
    
  }
  return list
}



function user_teacherQuery(sql) {
  let list = []
  for (const [id, username, password, email] of sqlcmd(sql)) {
    list.push({id, username, password, email})
  }
  return list
}

function user_studentQuery(sql) {
  let list = []
  for (const [id, username, password, email] of sqlcmd(sql)) {
    list.push({id, username, password, email})
  }
  return list
}

async function parseFormBody(body) {
  const pairs = await body.value
  const obj = {}
  for (const [key, value] of pairs) {
    obj[key] = value
  }
  return obj
}

/*從這裡開始*/
//login
async function loginUi(ctx) {
  ctx.response.body = await render.loginUi();
}


async function login(ctx) {
  const body = ctx.request.body()
  if (body.type === "form") {
    var user = await parseFormBody(body)
    var dbUsers = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${user.username}'`) // userMap[user.username]
    var dbUser = dbUsers[0]
    var pattern=/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
   /* const compare = "@"
    const compare1="$"
    if((user.password.includes(compare)==true)||(user.username.includes(compare)==true))
    {
      ctx.response.body = render.loginUi({status:'不可輸入特殊符號'})
    }*/ 
    if(pattern.test(user.password)||pattern.test(user.username))
    {
      ctx.response.body = render.loginUi({status:'不可輸入特殊符號'})
    }
    else
    {
      if (dbUser != null && dbUser.password === user.password ) {
        ctx.state.session.set('user', user)
        console.log('session.user=', await ctx.state.session.get('user'))
        ctx.response.redirect('/');
      }
  
      else 
      {
        ctx.response.body = render.loginUi({status:'這是傳給老師的'})
      } 

    }
    
   
  }
}

async function loginstu(ctx) {
  const body = ctx.request.body()
  if (body.type === "form") {
    var user = await parseFormBody(body)
    var dbUsers = user_studentQuery(`SELECT id, username, password, email FROM users_student WHERE username='${user.username}'`) // userMap[user.username]
    var dbUser = dbUsers[0]
    var pattern=/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
    if(pattern.test(user.password)||pattern.test(user.username))
    {
      ctx.response.body = render.loginUi({status:'不可輸入特殊符號'})
    }
    else{
      if (dbUser != null && dbUser.password === user.password ) {
        ctx.state.session.set('user', user)
        console.log('session.user=', await ctx.state.session.get('user'))
        ctx.response.redirect('/stu');
      }
  
      else 
      {
        ctx.response.body = render.loginUi({status:'這是傳給學生的'})
      } 

    }
   
  }
}


/*signup teacher */
async function signupUi(ctx) {
  var usercheck = await ctx.state.session.get('user')
  if(usercheck==null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
  }
  else
  {
  var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
  var safes = safe[0]
    if(safes==null)
    {
      ctx.response.body = render.loginUi({status:'請先登入'})
    }
    else
    {
      ctx.response.body = await render.signupUi();
    }
  }
  

  
}


async function signup(ctx) {
  var usercheck = await ctx.state.session.get('user')
  if(usercheck==null)usercheck.name=' '
  var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
  var safes = safe[0]
  if(usercheck != null&&safes!=null)
  {
    const body = ctx.request.body()
    if (body.type === "form") {
      var user = await parseFormBody(body)
      var dbUsers = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${user.username}'`)
      if (dbUsers.length === 0) {
        sqlcmd("INSERT INTO users_teacher (username, password, email) VALUES (?, ?, ?)", [user.username, user.password, user.email]);
        ctx.response.body = render.loginUi({status:'帳號創立成功，請重新登入'})
      } 
      else
      ctx.response.body = render.signupUi({status:'帳號已被創立'})
    }
  }
    
  else
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
    //ctx.response.redirect('/login');
  }





 
}

/*signup student */
async function signup_stuUi(ctx) {
  var usercheck = await ctx.state.session.get('user')
  if(usercheck == null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
  }
  else
  {

    var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
    var safes = safe[0]
    if(safes!=null)
    {
      ctx.response.body = await render.signup_stuUi();
    }
    
    else
    {
      ctx.response.body = render.loginUi({status:'請先登入'})
    //ctx.response.redirect('/login');
    }

  }
  
  
}

async function signup_stu(ctx) {
  var usercheck = await ctx.state.session.get('user')
  if(usercheck == null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
    //ctx.response.redirect('/login');
  }
    
    
  else
  {
    var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
    var safes = safe[0]
    if(safes==null)
    {
      const body = ctx.request.body()
      if (body.type === "form") 
      {
      var user = await parseFormBody(body)
      var dbUsers = user_studentQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${user.username}'`)
      if (dbUsers.length === 0) 
      {
        sqlcmd("INSERT INTO users_student (username, password, email) VALUES (?, ?, ?)", [user.username, user.password, user.email]);
        ctx.response.body = render.loginUi({status:'帳號創立成功，請重新登入'})
      } 
      else
      {
        ctx.response.body = render.signupUi({status:'帳號已被創立'})
      }
      
      }
    }

  }
}

/*確定沒問題*/
async function logout(ctx) {
   ctx.state.session.set('user', null)
   ctx.response.redirect('/login')
}
/*確定沒問題*/ 
async function list(ctx) {
  var usercheck = await ctx.state.session.get('user')
  if(usercheck==null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
  }
  else
  {
    var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
    var safes = safe[0]
    if(safes!=null)
    {
      let orderby = ctx.request.url.searchParams.get('orderby')
      orderby = orderby || 'id'
      let op = ctx.request.url.searchParams.get('op')
      op = op || 'ASC'
      let posts = postQuery(`SELECT id,username, title, body ,file,content FROM posts ORDER BY ${orderby} ${op}`)
      ctx.response.body = await render.list(posts, await ctx.state.session.get('user'));
    }
    
    else
    {
      ctx.response.body = render.loginUi({status:'請先登入'})
    //ctx.response.redirect('/login');
    }
  }
  
}
/*確定沒問題*/
async function liststu(ctx) {

  var usercheck = await ctx.state.session.get('user')
  if(usercheck != null)
  {
    let orderby = ctx.request.url.searchParams.get('orderby')
    orderby = orderby || 'id'
    let op = ctx.request.url.searchParams.get('op')
    op = op || 'ASC'
    let posts = postQuery(`SELECT id,username, title, body ,file ,content FROM posts ORDER BY ${orderby} ${op}`)
    ctx.response.body = await render.liststu(posts, await ctx.state.session.get('user'));
    }
    
  else
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
  }

  
}



async function editaccount(ctx) {
  var usercheck = await ctx.state.session.get('user')
  if(usercheck==null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})

  }
  else
  {
    var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
    var safes = safe[0]
    if(safes!=null)
    {
      let users = user_studentQuery(`SELECT id,username, password FROM users_student `)
      ctx.response.body = await render.editaccount(users);
    }

    else 
    {
      ctx.response.body = render.loginUi({status:'請先登入'})
    }

  }
  
  
    
}


async function add(ctx) {
  var user = await ctx.state.session.get('user')
  if (user != null) {
    ctx.response.body = await render.newPost();
  } else {
    ctx.response.body = render.loginUi({status:'請先登入'})
  }
  
}

async function addstu(ctx) {
  var user = await ctx.state.session.get('user')
  if (user != null) {
    ctx.response.body = await render.newPoststu();
  } else {
    ctx.response.body = render.loginUi({status:'請先登入'})
  }
}



async function delpost(ctx) {
  var usercheck = await ctx.state.session.get('user')
  var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
  var safes = safe[0]
  if(usercheck != null && safes!=null)
  {
    const pid = ctx.params.id;
    postQuery(`DELETE FROM posts WHERE id='${pid}'`)
    ctx.response.redirect('/');
  }
    
  else
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
    //ctx.response.redirect('/login');
  }


  
}

async function delaccount(ctx) {
  var usercheck = await ctx.state.session.get('user')
  var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
  var safes = safe[0]
  if(usercheck != null&&safes!=null)
  {
    const pid = ctx.params.id;
    postQuery(`DELETE FROM users_student WHERE id='${pid}'`)
    ctx.response.redirect('/editaccount');
  }
    
  else
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
    //ctx.response.redirect('/login');
  }

  
  
}


async function editpostui(ctx) {
 
  var usercheck = await ctx.state.session.get('user')
  var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
  var safes = safe[0]
  if(usercheck==null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})

  }
  else{
    var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
    var safes = safe[0]
    if(safes!=null)
    {
      const pid = ctx.params.id;
    let posts = postQuery(`SELECT id, username, title, body,file,content FROM posts WHERE id=${pid}`)
    let post = posts[0]
    if (!post) ctx.throw(404, 'invalid post id');
    ctx.response.body = await render.editpostui(post);
    }

    else 
    {
      ctx.response.body = render.loginUi({status:'請先登入'})
    }
  }
  
}
async function editpost(ctx) 
{
  const body = ctx.request.body()
  const form = await multiParser(ctx.request.serverRequest)
    if (form ) {
      var filename = form.files.file.filename
      let content = form.files.file.content
      if(filename==''){
        ctx.response.body = await render.newPost({status:'請上傳檔案'});
       return;
      }
      await Deno.writeFile(`./images/${filename}`, content);
    }
  
    var user = await ctx.state.session.get('user')
    if (user != null) {
      const pid = ctx.params.id;
      //console.log("今天天氣很好1214",form.fields.title,form.fields.body,filename,form.fields.content,form.id)
      sqlcmd(`UPDATE posts SET "title"='${form.fields.title}',"body"='${ form.fields.body}',"file"='${filename}',"content"='${form.fields.content}'WHERE id='${pid}';`)
    } 
    
      else {
      ctx.throw(404, 'not login yet!');
    }
    ctx.response.redirect('/');


  }


async function editpasswordui(ctx) {
  const pid = ctx.params.id;
  var usercheck = await ctx.state.session.get('user')
  if(usercheck == null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
  }
  else
  {
  var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
  var safes = safe[0]
  if(safes!=null)
  {
  let users = user_studentQuery(`SELECT id, username, password, email FROM users_student WHERE id=${pid}`)
  let user=users[0]
    ctx.response.body = await render.editpasswordui(user);
  }
  else
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
  }
  }
 
  

}
/*這是已經好的*/ 
async function editpassword(ctx) {
  const pid = ctx.params.id;
  const body = ctx.request.body()
  if (body.type === "form") {
    var account = await parseFormBody(body)
    var user = await ctx.state.session.get('user')
    
    
    if (user != null)
    {
    sqlcmd(`UPDATE users_student SET "username"='${account.username}',"password"='${account.password}'WHERE id='${pid}';`)
    } 
    else {
      ctx.throw(404, 'not login yet!');
    }
    ctx.response.redirect('/editaccount');
  }
}


async function create(ctx) {
  const body = ctx.request.body()
  const form = await multiParser(ctx.request.serverRequest)
    if (form ) {
      var filename = form.files.file.filename
      let content = form.files.file.content
      if(filename==''){
        ctx.response.body = await render.newPost({status:'請上傳檔案'});
       return;
      }
      await Deno.writeFile(`./images/${filename}`, content);
    }
  
    var user = await ctx.state.session.get('user')
    if (user != null) {
      console.log('user=', user)
      sqlcmd("INSERT INTO posts (username, title, body,file,content) VALUES (?, ?, ?,?,?)", [user.username, form.fields.title, form.fields.body,filename,form.fields.content]);
    } 
    else {
      ctx.throw(404, 'not login yet!');
    }
    ctx.response.redirect('/');



}

async function createstu(ctx) {
  const body = ctx.request.body()
  const form = await multiParser(ctx.request.serverRequest)
    if (form ) {
      var filename = form.files.file.filename
      let content = form.files.file.content
      if(filename==''){
        ctx.response.body = await render.newPost({status:'請上傳檔案'});
       return;
      }
      await Deno.writeFile(`./images/${filename}`, content);
    }
  
    var user = await ctx.state.session.get('user')
    if (user != null) {
      console.log('user=', user)
      sqlcmd("INSERT INTO posts (username, title, body,file,content) VALUES (?, ?, ?,?,?)", [user.username, form.fields.title, form.fields.body,filename,form.fields.content]);
    } 
    else {
      ctx.throw(404, 'not login yet!');
    }
    ctx.response.redirect('/stu');



}



async function show(ctx) {
  const pid = ctx.params.id;
  let posts = postQuery(`SELECT id, username, title, body,file,content FROM posts WHERE id=${pid}`)
  let post = posts[0]
  if (!post) ctx.throw(404, 'invalid post id');
  ctx.response.body = await render.show(post);
}


console.log('Server run at http://127.0.0.1:8025/login');

await app.listen({port: 8025 });