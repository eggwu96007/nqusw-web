import { Application, Router,send } from "https://deno.land/x/oak@v6.5.0/mod.ts";
import * as render from './render.js'
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Session } from "https://deno.land/x/session@1.1.0/mod.ts";
import { multiParser} from 'https://deno.land/x/multiparser@v2.1.0/mod.ts'
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT, username TEXT, body TEXT, file TEXT , content TEXT)");
db.query("CREATE TABLE IF NOT EXISTS users_student (id INTEGER PRIMARY KEY AUTOINCREMENT, account TEXT, password TEXT, username TEXT)");
db.query("CREATE TABLE IF NOT EXISTS users_teacher (id INTEGER PRIMARY KEY AUTOINCREMENT, account TEXT, password TEXT, username TEXT)");

const router = new Router();

router.get('/', list) 
.get('/home', homeUi)
.get('/about', aboutUi)
  //.get('/stu', liststu)
  .get('/signup_teacher', signup_teacherUi)
  .post('/signup_teacher', signup_teacher)
  .get('/signup_student', signup_studentUi)
  .post('/signup_student', signup_student)
  .get('/login', loginUi)
  .post('/login', login)
  .get('/loginstu', loginUi)
  .post('/loginstu', loginstu)
  .get('/logout', logout)
  .get('/editaccount',editaccount)
  .get('/delaccount_user/:id',delaccount_user)
  //帳號管理還差重複性問題
  .post('/editpassword_user_for_root/:id',editpassword_user_for_root)
  .get('/editpassword_user/:id',editpassword_userui)
  .post('/editpassword_user/:id',editpassword_user)
  .get('/editpassword_root/:id',editpassword_rootui)
  .post('/editpassword_root/:id',editpassword_root)
  .get('/editpost/:id',editpostui)
  .post('/editpost/:id',editpost)
  .get('/delpost/:id',delpost)
  .post('/post', create)
  .get('/post/new', add)
  .post('/list_custom', list_custom)
  .get('/list_custom', list_custom)
  .post('/list_custom_stu', list_custom_stu)
  .get('/list_custom_stu', list_custom_stu)
  .post('/list_custom', list_custom)
  .get('/list_custom', list_custom)
  
  .post('/list_gratuate', list_gratuate)
  .get('/list_gratuate', list_gratuate)
  .get('/post/new', add)
  .get('/post/:id', show)
/*===上面示好的=== */
 
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



function userQuery(sql) {
  let list = []
  for (const [id, account, password, username] of sqlcmd(sql)) {
    list.push({id, account, password, username})
  }
  return list
}

/*function userQuery(sql) {
  let list = []
  for (const [id, username, password, email] of sqlcmd(sql)) {
    list.push({id, username, password, email})
  }
  return list
}*/

async function parseFormBody(body) {
  const pairs = await body.value
  const obj = {}
  for (const [key, value] of pairs) {
    obj[key] = value
  }
  return obj
}

/*從這裡開始*/
/*1223check*/ 
async function loginUi(ctx) {
  var user = await ctx.state.session.get('user')
  ctx.response.body = await render.loginUi(user);
}

async function homeUi(ctx) {
  var user = await ctx.state.session.get('user')
  if(user==undefined)
  {
    ctx.response.body = await render.homeUi(user)
  }
  else if (user!=undefined)
  {
    var safe = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE account='${user.username}'`)
    var safes = safe[0]

    var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE account='${user.username}'`)
    var users = user[0]
    if(safes!=null)
    {
      console.log("safe是啥",safes)
      ctx.response.body = await render.homeUi(safes);  
    }
    else if(users!=null)
    {
      console.log("user是啥",users)
      ctx.response.body = await render.homeUi(users);  
    }
    
  }
  
  
}

async function aboutUi(ctx) {
  

  var user = await ctx.state.session.get('user')
  if(user==undefined)
  {
    ctx.response.body = await render.aboutUi(user)
  }

  else
  {
    var safe = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${user.username}'`)
    var safes = safe[0]
    var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${user.username}'`)
    var users = user[0]
    if(safes!=null)
    {
      ctx.response.body = await render.aboutUi(safes);
    }
    else if(users!=null)
    {
      ctx.response.body = await render.aboutUi(users);
    }
    
  }
}

/*1223check*/
/*大問題，密碼錯誤要怎麼跳回原本的樣子*/ 
async function login(ctx) {
  var usercheck = await ctx.state.session.get('user')
  const body = ctx.request.body()
  if (body.type === "form") {
    var input = await parseFormBody(body)
    var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE account='${input.account}'`) // userMap[user.username]
    var roots = root[0]
    var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE account='${input.account}'`)
    var users = user[0]
    var pattern=/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
    if(pattern.test(input.password)||pattern.test(input.account))
    {
      ctx.response.body = render.middle({status:'不可輸入特殊符號'},usercheck)
      return;
    }
console.log("幹右怎麼了",input.password,roots.password,roots)
      //管理者
      if (roots != null &&roots.password === input.password) {
        console.log("你好1")
        ctx.state.session.set('user', roots)
       
        //ctx.response.redirect('/list_gratuate');
        ctx.response.redirect('/');
        return;
      }
  //使用者
      else if(users != null && users.password === input.password)
      {
        ctx.state.session.set('user', users)
       ctx.response.redirect('/'); 
       return;
      } 
//密碼錯誤
      else 
      {
        console.log("你好3")
        ctx.response.body = render.middle({status:'密碼錯誤'},usercheck);
      }
  }
}

/*1223check*/
async function loginstu(ctx) {
  const body = ctx.request.body()
  if (body.type === "form") {
    var user = await parseFormBody(body)
    var dbUsers = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${user.username}'`) // userMap[user.username]
    var dbUser = dbUsers[0]
    var pattern=/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
    if(pattern.test(user.password)||pattern.test(user.username))
    {
      ctx.response.body = render.loginUi({status:'不可輸入特殊符號'})
      return;
    }
    else{
      if (dbUser != null && dbUser.password === user.password ) {
        ctx.state.session.set('user', user)
        console.log('session.user=', await ctx.state.session.get('user'))
        ctx.response.redirect('/stu');
        return;
      }
  
      else 
      {
        ctx.response.body = render.loginUi({status:'這是傳給學生的'})
        return;
      } 

    }
   
  }
}


/*signup teacher */
/*1223check*/
async function signup_teacherUi(ctx) {
  var usercheck = await ctx.state.session.get('user')
  if(usercheck==null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
  }

  else if(usercheck!=null)
  {
  var safe = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`)
  var safes = safe[0]
    if(safes!=null)
    {
      ctx.response.body = await render.signup_teacherUi();
      
    }
    else
    {
      ctx.response.body = render.loginUi({status:'請先登入'})
    }
  }
  

  
}

/*1223check*/ 
async function signup_teacher(ctx) {
  const body = ctx.request.body()
  var user = await parseFormBody(body)
  var pattern=/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
  var usercheck = await ctx.state.session.get('user')
  if(usercheck == null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
   return;
  }
    
  else
  {
    
    var safe = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`)
    var safes = safe[0]
    if(safes!=null)
    {
      if(pattern.test(user.password)||pattern.test(user.username)||pattern.test(user.email)||user.email==''||user.username==''||user.password=='')
      {
        ctx.response.body = render.signup_teacherUi({status:'不可輸入特殊符號或空白'})
        return;
      }
      if (body.type === "form") 
      {
      var dbUsers = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${user.username}'`)
      if (dbUsers.length === 0) 
      {
        sqlcmd("INSERT INTO users_teacher (account, password, username) VALUES (?, ?, ?)", [user.account, user.password, user.username]);
        ctx.response.body = render.loginUi({status:'帳號創立成功，請重新登入'})
      } 
      else
      {
        ctx.response.body = render.signup_teacherUi({status:'帳號已被創立'})
      }
      
      }
    }
    else
    {
      ctx.response.body = render.loginUi({status:'請先登入'})
    }

  }
}
 
/*signup student */
/*1223check*/ 
async function signup_studentUi(ctx) {
  var usercheck = await ctx.state.session.get('user')
  if(usercheck == null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
  }
  else if(usercheck!=null)
  {
    var safe = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`)
    var safes = safe[0]
    if(safes!=null)
    {
      ctx.response.body = await render.signup_studentUi();
    }
    
    else
    {
      ctx.response.body = render.loginUi({status:'請先登入'})
    }

  }
  
  
}
/*1223check*/ 
async function signup_student(ctx) {
  const body = ctx.request.body()
  var user = await parseFormBody(body)
  var pattern=/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
  var usercheck = await ctx.state.session.get('user')
  if(usercheck == null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
   return;
  }
    
  else
  {
    
    var safe = userQuery(`SELECT id,account, password, username FROM users_teacher WHERE username='${usercheck.username}'`)
    var safes = safe[0]
    if(safes!=null)
    {
      if(pattern.test(user.password)||pattern.test(user.username)||pattern.test(user.email)||user.email==''||user.username==''||user.password=='')
      {
        ctx.response.body = render.signup_studentUi({status:'不可輸入特殊符號或空白'})
        return;
      }
      if (body.type === "form") 
      {
      var dbUsers = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${user.username}'`)
      if (dbUsers.length === 0) 
      {
        sqlcmd("INSERT INTO users_student (account, password, username) VALUES (?, ?, ?)", [user.username, user.password, user.email]);
        ctx.response.body = render.loginUi({status:'帳號創立成功，請重新登入'})
      } 
      else
      {
        ctx.response.body = render.signup_studentUi({status:'帳號已被創立'})
      }
      
      }
    }
    else
    {
      ctx.response.body = render.loginUi({status:'請先登入'})
    }

  }
}
 


/*0422check*/
async function logout(ctx) {
   ctx.state.session.set('user', null)
   ctx.response.body = render.homeUi()
}
/*1223check */
async function list(ctx) {
  var usercheck = await ctx.state.session.get('user')
  console.log("usercheck是啥",usercheck)
  if(usercheck==null)
  {
    //ctx.response.body = render.loginUi({status:'請先登入'})
    ctx.response.body = render.middle({status:'請先登入'},usercheck);
  }
  else if(usercheck!=null)
  {
    let orderby = ctx.request.url.searchParams.get('orderby')
    orderby = orderby || 'id'
    let op = ctx.request.url.searchParams.get('op')
    op = op || 'ASC'
      
    var posts = postQuery(`SELECT id,username, title, body ,file,content FROM posts ORDER BY ${orderby} ${op}`)
    ctx.response.body = await render.list(posts,usercheck.username);
    }

  }
   
    /*var safe = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`)
    var safes = safe[0]
    var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
    var users = user[0]

    if(safes!=null)
    var checkuser=safes
    if(users!=null)
    var checkuser = users
    if((safes!=null)&&(users==null))
    {

      let orderby = ctx.request.url.searchParams.get('orderby')
      orderby = orderby || 'id'
      let op = ctx.request.url.searchParams.get('op')
      op = op || 'ASC'
      
      var posts = postQuery(`SELECT id,username, title, body ,file,content FROM posts ORDER BY ${orderby} ${op}`)
      ctx.response.body = await render.list(posts,checkuser);
    }

    else if((safes==null)&&(users!=null))
    {
      let orderby = ctx.request.url.searchParams.get('orderby')
      orderby = orderby || 'id'
      let op = ctx.request.url.searchParams.get('op')
      op = op || 'ASC'
      
      var posts = postQuery(`SELECT id,username, title, body ,file,content FROM posts ORDER BY ${orderby} ${op}`)
      ctx.response.body = await render.list(posts,users);
      
    }
    else
    {
      ctx.response.body = render.loginUi({status:'請先登入'})
    }
  }
  
}
/*跟list合併
async function liststu(ctx) {
 var usercheck = await ctx.state.session.get('user')
  if(usercheck==null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
  }
  else if(usercheck!=null)
  {
    var safe = userQuery(`SELECT id, username, password, email FROM users_student WHERE username='${usercheck.username}'`)
    var safes = safe[0]
      let orderby = ctx.request.url.searchParams.get('orderby')
      orderby = orderby || 'id'
      let op = ctx.request.url.searchParams.get('op')
      op = op || 'ASC'
      var posts = postQuery(`SELECT id,username, title, body ,file,content FROM posts ORDER BY ${orderby} ${op}`)
      console.log("1226",posts,safes)
      ctx.response.body = await render.liststu(posts,safes);
     return;
  }
  
}
*/

async function list_gratuate(ctx) {
  var usercheck = await ctx.state.session.get('user')
  var safe = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`)
    var safes = safe[0]
    var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
    var users = user[0]
    if(safes!=null)
    var checkuser=safes
    if(users!=null)
    var checkuser = users
  const body = ctx.request.body()
  if(usercheck==null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
   
    return;
  }
  
  else{
    var posts = postQuery(`SELECT id,username, title, body ,file,content FROM posts WHERE body LIKE '%畢業專題%';`) 
    ctx.response.body = await render.list(posts,checkuser);

  }

}


/*1223check */
async function list_custom(ctx) {
  var usercheck = await ctx.state.session.get('user')
  const body = ctx.request.body()
  if(usercheck==null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
    return;
  }
  else
  {
    var safe = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`)
    var safes = safe[0]
    if(safes==null)
    {
      ctx.response.body = render.loginUi({status:'請先登入'})
    return;
    }
    else
    {
      if (body.type === "form") {
        var search = await parseFormBody(body)
        var user = await ctx.state.session.get('user')
      if(usercheck != null)
      {
        /*let orderby = ctx.request.url.searchParams.get('orderby')
        orderby = orderby || 'id'
        let op = ctx.request.url.searchParams.get('op')
        op = op || 'ASC'*/
        
        var see=search.search.split(" ")
       
        //var see=search.search.split(/\s+/)
       var str = ''
       console.log("1228",see);
        var i=0
       var patten=[] 
       
       while(see[i]!=null)
       { 
        str=str+" OR title LIKE '%" + see[i]+ "%' OR content LIKE '%"+see[i]+ "%' OR username LIKE '%"+see[i]+  "%' OR body LIKE '%" +see[i]+"%'" 
        i++;
       }
       var posts = postQuery(`SELECT id,username, title, body ,file,content FROM posts WHERE title LIKE '%${search.search}%' OR content LIKE '%${search.search}%' OR username LIKE '%${search.search}%' OR body LIKE '%${search.search}%'${str};`) 
      ctx.response.body = await render.list(posts,safes.email);
        return;
        }
        
      else
      {
        ctx.response.body = render.loginUi({status:'請先登入'})
        return;
      }
        
      }
    }
    }
    
  
}

/*1223check */
async function list_custom_stu(ctx) {
  var usercheck = await ctx.state.session.get('user')
  const body = ctx.request.body()
  if(usercheck==null)
  {
    ctx.response.body = render.middle({status:'請先登入'},user)
        return;
  }
  else
  {
    var safe = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
    var safes = safe[0]
    if(safes==null)
    {
      ctx.response.body = render.loginUi({status:'請先登入'})
      return;
    }
    else
    {
      if (body.type === "form") {
        var search = await parseFormBody(body)
      if(usercheck != null)
      {
      var see=search.search.split(" ")
      var str = ''
      var i=0
      
       
       while(see[i]!=null)
       {
        if(search.title!=null)
        {
          console.log("跑1")
          str=str+" OR title LIKE '%" + see[i]+ "%' " 
        }
          
        if(search.body!=null)
        {
          console.log("跑2")
          str=str+" OR body LIKE '%" + see[i]+ "%' " 
        }
        
        if(search.username!=null)
        {
          console.log("跑3")
          str=str+" OR username LIKE '%" + see[i]+ "%' " 
        }
        
        if(search.content!=null)
        {
          console.log("跑4")
          str=str+" OR content LIKE '%" + see[i]+ "%' " 
        }
        
        if(search.title==null&&search.body==null&&search.username==null&&search.content==null)
        {
          str=str+" OR title LIKE '%" + see[i]+ "%' OR content LIKE '%"+see[i]+ "%' OR username LIKE '%"+see[i]+  "%' OR body LIKE '%" +see[i]+"%'" 
          console.log("跑5")
        }
        i++;
       }
       console.log("GG啦",str)
       var posts = postQuery(`SELECT id,username, title, body ,file,content FROM posts WHERE title LIKE '%真他媽聰明阿%' ${str};`)
       ctx.response.body = await render.liststu(posts,safes);
       str=''
        return;
        }
        
      else
      {
        ctx.response.body = render.loginUi({status:'請先登入'})
        return;
      }
    }
    
      
    }
  }
  
}


/*1223check*/ 
async function editaccount(ctx) {
  var usercheck = await ctx.state.session.get('user')
  if(usercheck==null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
    return;

  }
  else
  {
    var safe = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`)
    var safes = safe[0]
    if(safes!=null)
    {
      let users = userQuery(`SELECT id,account, password, username FROM users_student `)
      let roots = userQuery(`SELECT id,account, password, username FROM users_teacher `)
      ctx.response.body = await render.editaccount(users,roots);
      return;
    }

    else 
    {
      ctx.response.body = render.loginUi({status:'請先登入'})
      return;
    }

  }
  
  
    
}



/*1223check */
async function add(ctx) {
  var usercheck = await ctx.state.session.get('user')
  if (usercheck != null) {
    var safe = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`)
    var safes = safe[0]
    if(safes==null)
    {
      ctx.response.body = render.loginUi({status:'請先登入'})
    return;
    }
    else
    {
      ctx.response.body = await render.newPost();
      return;
    }
    
  } 
  else {
    ctx.response.body = render.loginUi({status:'請先登入'})
    return;
  }
  
}

/*async function addstu(ctx) {
  var user = await ctx.state.session.get('user')
  if (user != null) {
    ctx.response.body = await render.newPoststu();
  } else {
    ctx.response.body = render.loginUi({status:'請先登入'})
  }
}*/


//1223check
async function delpost(ctx) {
  var usercheck = await ctx.state.session.get('user')
  if(usercheck != null)
  {
    var safe = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`)
    var safes = safe[0]
    if(safes!=null)
    {
    const pid = ctx.params.id;
    postQuery(`DELETE FROM posts WHERE id='${pid}'`)
    ctx.response.redirect('/');
    return;
    }
    else
    {
      ctx.response.body = render.loginUi({status:'請先登入'})
      return;
    }
    
  }
    
  else
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
    return;
  }


  
}
/*1223check*/ 
async function delaccount_user(ctx) {
  var usercheck = await ctx.state.session.get('user')
  if(usercheck != null)
  {
    var safe = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`)
    var safes = safe[0]
    if(safes!=null)
    {
    const pid = ctx.params.id;
    postQuery(`DELETE FROM users_student WHERE id='${pid}'`)
    ctx.response.redirect('/editaccount');
    return;  
    }
    
    else
    {
    ctx.response.body = render.loginUi({status:'請先登入'})
    return;
    }

  }
    
  else
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
    return;
  }

  
  
}
/*use or not???*/ 
/*async function delaccount_root(ctx) {
  var usercheck = await ctx.state.session.get('user')
  var safe = userQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
  var safes = safe[0]
  if(usercheck != null&&safes!=null)
  {
    const pid = ctx.params.id;
    postQuery(`DELETE FROM users_teacher WHERE id='${pid}'`)
    ctx.response.redirect('/editaccount');
  }
    
  else
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
    //ctx.response.redirect('/login');
  }

  
  
}*/

//1223check
async function editpostui(ctx) {
 
  var usercheck = await ctx.state.session.get('user')
  if(usercheck==null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
    return;

  }
  else{
    var safe = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`)
    var safes = safe[0]
    if(safes!=null)
    {
    const pid = ctx.params.id;
    let posts = postQuery(`SELECT id, username, title, body,file,content FROM posts WHERE id=${pid}`)
    let post = posts[0]
    if (!post) ctx.throw(404, 'invalid post id');
    ctx.response.body = await render.editpostui(post);
    return;
    }

    else 
    {
      ctx.response.body = render.loginUi({status:'請先登入'})
      return;
    }
  }
  
}
//1223check
async function editpost(ctx) 
{
  const pid = ctx.params.id;
  var usercheck = await ctx.state.session.get('user')
  if(usercheck==null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
    return; 
  }
  else
  {
    var safe = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`)
    var safes = safe[0]
    if(safes!=null)
    {
      const body = ctx.request.body()
      const form = await multiParser(ctx.request.serverRequest)
      var user = await ctx.state.session.get('user')
      var pattern=/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
      var pattern_only=/[`@#$%^&*_+<>{}\/[\]]/im;
      let posts = postQuery(`SELECT id, username, title, body,file,content FROM posts WHERE id=${pid}`)
      let post = posts[0]
        if (form ) {
          var filename = form.files.file.filename
          let content = form.files.file.content
          if(filename==''){
            ctx.response.body = await render.editpostui(post,{status:'請上傳檔案'});
           return;
          }
          await Deno.writeFile(`./images/${filename}`, content);
        }
      
        if( form.fields.title==''|| form.fields.body==''||form.fields.content=='')
        {
          ctx.response.body = await render.editpostui(post,{status:'不可空白'});
          return;
        }
    
        if(pattern.test(form.fields.title)||pattern_only.test(form.fields.body)||pattern.test(form.fields.content))
        {
          ctx.response.body = render.editpostui(post,{status:'不可輸入特殊符號'})
          return;
        }
          
          var validExts = new Array(".pdf");
    
          var fileExt = filename;
          fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
          if (validExts.indexOf(fileExt) < 0) {
            ctx.response.body = await render.editpostui(post,{status:"檔案類型錯誤，可接受檔案類型為pdf"});
            fileExt = null;
           return;
        } 
        var year =form.fields.body1+form.fields.body2 
        if(form.fields.content1==null)form.fields.content1=''
        if(form.fields.content2==null)form.fields.content2=''
        if(form.fields.content3==null)form.fields.content3=''
        if(form.fields.content4==null)form.fields.content4=''
        if(form.fields.content5==null)form.fields.content5=''
        if(form.fields.content6==null)form.fields.content6=''
        if(form.fields.content7==null)form.fields.content7=''
        if(form.fields.content8==null)form.fields.content8=''
        var content=form.fields.content1+form.fields.content2+form.fields.content3+form.fields.content4+form.fields.content5+form.fields.content6+form.fields.content7+form.fields.content8
        sqlcmd(`UPDATE posts SET "username"='${form.fields.author}',"title"='${form.fields.title}',"body"='${year}',"file"='${filename}',"content"='${content}'WHERE id='${pid}';`)
        ctx.response.redirect('/');
      return;
    }
    else
    {
      ctx.response.body = render.loginUi({status:'請先登入'})
      return; 
    }
  }

  }

/*1223check*/ 
async function editpassword_userui(ctx) {
  var usercheck = await ctx.state.session.get('user')
  const pid = ctx.params.id;
  if(usercheck == undefined)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
    return;
  }
  else
  {
  var safe = userQuery(`SELECT id,account, password, username FROM users_teacher WHERE username='${usercheck.username}' AND id=${pid}`)
  var safes = safe[0]
  
  var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}' AND id=${pid}`)
  var users = user[0]
  if(safes!=null)
  {

    ctx.response.body = await render.editpassword_userui(safes);
    return;
  }
  else if(users!=null)
  {
    ctx.response.body = await render.editpassword_userui(users);
    return;
  }
  
  }
 
  

}
/*1223check*/ 
async function editpassword_user(ctx) {
  const pid = ctx.params.id;
  const body = ctx.request.body()
  var usercheck = await ctx.state.session.get('user')
  var account = await parseFormBody(body)
  var pattern=/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;

  if(usercheck == null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
    return;
  }
  else
  {
    var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}' AND id=${pid}`)
    var users = user[0]
  
    var safe = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}' AND id=${pid}`)
    var safes = safe[0]
    
//檢查輸入是否有特殊自原
    if(pattern.test(account.password_check)||pattern.test(account.password_new)||pattern.test(account.password_new_check)||account.password_new_check==''||account.password_check==''||account.password_new=='')
    {
      ctx.response.body = await render.editpassword_userui(safes,{status:'不可輸入特殊符號或空白'});
      return;
    }
    //確定teacher密碼修改
    if(safes!=null)
    {
    if (body.type === "form"&&safes.password==account.password_check&&account.password_new==account.password_new_check) 
    {
      sqlcmd(`UPDATE users_teacher SET "password"='${account.password_new}'WHERE id='${pid}';`)
      ctx.response.body = render.loginUi({status:'修改成功'})
      return;
    }
    else if(body.type === "form"&&safes.password==account.password_check&&account.password_new!=account.password_new_check) 
    {
      ctx.response.body = await render.editpassword_userui(safes,{status:'新密碼與再次確認密碼有誤'});
    return;
    }

    else
    {
      ctx.response.body = await render.editpassword_userui(safes,{status:'舊密碼錯誤'});
    return;
    }
  }
    //確定student密碼修改
    else if(users!=null)
    {
    if (body.type === "form"&&users.password==account.password_check&&account.password_new==account.password_new_check) 
    {
      sqlcmd(`UPDATE users_student SET "password"='${account.password_new}'WHERE id='${pid}';`)
      ctx.response.body = render.loginUi({status:'修改成功'})
      return;
    }
    else if(body.type === "form"&&users.password==account.password_check&&account.password_new!=account.password_new_check) 
    {
      ctx.response.body = await render.editpassword_userui(users,{status:'新密碼與再次確認密碼有誤'});
    return;
    }

    else
    {
      ctx.response.body = await render.editpassword_userui(users,{status:'舊密碼錯誤'});
    return;
    }

  }

  /*else if(roots!=null)
  {
    if (body.type === "form") {
      var account = await parseFormBody(body)
      sqlcmd(`UPDATE users_student SET "password"='${account.password_new}'WHERE id='${pid}';`)
      ctx.response.redirect('/editaccount');
      return;
    }
  }*/
  else
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
    return;
  }
  }

  
}
/*1223check*/
async function editpassword_rootui(ctx) {
  const pid = ctx.params.id;
  var usercheck = await ctx.state.session.get('user')
  if(usercheck == null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
    return;
  }
  else
  {
  var safe = userQuery(`SELECT id,account, password, username FROM users_teacher WHERE username='${usercheck.username}'`)
  var safes = safe[0]
  if(safes!=null)
  {
  let users = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE id=${pid}`)
  let user=users[0]
    ctx.response.body = await render.editpassword_rootui(user);
    return;
  }
  else
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
    return;
  }
  }
 
  

}
/*1223check */
async function editpassword_root(ctx) {
  const pid = ctx.params.id;
  const body = ctx.request.body()
  var account = await parseFormBody(body)
  var usercheck = await ctx.state.session.get('user')
  var pattern=/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
  
  if(usercheck == null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
    return;
  }
  else
  {
  var safe = userQuery(`SELECT id,account, password, username FROM users_teacher WHERE username='${usercheck.username}'`)
  var safes = safe[0]
  if(pattern.test(account.account)||pattern.test(account.password)||account.account==''||account.password=='')
    {
      ctx.response.body = await render.editpassword_rootui(safes,{status:'不可輸入特殊符號或空白'});
      return;
    }

  if(safes!=null)

  {
    if (body.type === "form") {
      sqlcmd(`UPDATE users_teacher SET "username"='${account.account}',"password"='${account.password}'WHERE id='${pid}';`)
      ctx.response.redirect('/editaccount');
      return;
    }
  }

  else
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
    return;
  }
   
  }
  
}

/*1223check*/
async function editpassword_user_for_root(ctx) {
  const pid = ctx.params.id;
  const body = ctx.request.body()
  var account = await parseFormBody(body)
  var usercheck = await ctx.state.session.get('user')
  var pattern=/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
  if(usercheck == null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
    return;
  }
  else
  {
  var safe = userQuery(`SELECT id, account, password, username FROM users_student WHERE id='${pid}'`)
  var safes = safe[0]
  if(pattern.test(account.account)||pattern.test(account.password)||pattern.test(account.username)||account.account==''||account.password==''||account.username=='')
    {
      ctx.response.body = await render.editpassword_user_for_rootui(safes,{status:'不可輸入特殊符號或空白'});
      return;
    }
  if(safes!=null)
  {
    if (body.type === "form") {
     
      sqlcmd(`UPDATE users_student SET "account"='${account.account}',"password"='${account.password}',"username"='${account.username}' WHERE id='${pid}';`)
      ctx.response.redirect('/editaccount');
      return;
    }
  }

  else
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
    return;
  }
   
  }
  
}


/*1223check*/
async function create(ctx) {
  const body = ctx.request.body()
  const form = await multiParser(ctx.request.serverRequest)
  var user = await ctx.state.session.get('user')
  var pattern=/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
  var pattern_only=/[`@#$%^&*_+<>{}\/[\]]/im;
    if (form ) {
      var filename = form.files.file.filename
      let content = form.files.file.content
      if(filename==''){
        ctx.response.body = await render.newPost({status:'請上傳檔案'});
       return;
      }
      await Deno.writeFile(`./images/${filename}`, content);
    }
  
    if( form.fields.title==''|| form.fields.body==''||form.fields.content=='')
    {
      ctx.response.body = await render.newPost({status:'不可空白'});
      return;
    }

    if(pattern.test(form.fields.title)||pattern_only.test(form.fields.body)||pattern.test(form.fields.content))
    {
      ctx.response.body = render.newPost({status:'不可輸入特殊符號'})
      return;
    }

    if (user != null) {
      
      var validExts = new Array(".pdf");

      var fileExt = filename;
      fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
      if (validExts.indexOf(fileExt) < 0) {
        ctx.response.body = await render.newPost({status:"檔案類型錯誤，可接受檔案類型為pdf"});
        fileExt = null;
        return ;
      }
        
        var year =form.fields.body1+form.fields.body2 
        if(form.fields.content1==null)form.fields.content1=''
        if(form.fields.content2==null)form.fields.content2=''
        if(form.fields.content3==null)form.fields.content3=''
        if(form.fields.content4==null)form.fields.content4=''
        if(form.fields.content5==null)form.fields.content5=''
        if(form.fields.content6==null)form.fields.content6=''
        if(form.fields.content7==null)form.fields.content7=''
        if(form.fields.content8==null)form.fields.content8=''
       /* console.log("改完後")
        console.log("0105-6",form.fields.content1)
        console.log("0105-6",form.fields.content2)
        console.log("0105-6",form.fields.content3)
        console.log("0105-6",form.fields.content4)
        console.log("0105-6",form.fields.content5)
        console.log("0105-6",form.fields.content6)
        console.log("0105-6",form.fields.content7)
        console.log("0105-6",form.fields.content8)*/
       // var re=/undefined/gi
        var content=form.fields.content1+form.fields.content2+form.fields.content3+form.fields.content4+form.fields.content5+form.fields.content6+form.fields.content7+form.fields.content8
        //var content=str.replace(re, ' ');
        //console.log("######",str)
//console.log(user.username, form.fields.title, form.fields.body,filename,form.fields.content)
      sqlcmd("INSERT INTO posts (username, title, body,file,content) VALUES (?, ?, ?,?,?)", [form.fields.author, form.fields.title, year,filename,content]);
    } 
    else {
      ctx.throw(404, 'not login yet!');
    }
    ctx.response.redirect('/');



}
/*
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



}*/


/*1223check */
async function show(ctx) {
  const pid = ctx.params.id;
  let posts = postQuery(`SELECT id, username, title, body,file,content FROM posts WHERE id=${pid}`)
  let post = posts[0]
  if (!post) ctx.throw(404, 'invalid post id');
  ctx.response.body = await render.show(post);
}




console.log('Server run at http://127.0.0.1:8025/home');

await app.listen({port: 8025 });