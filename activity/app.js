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
/*1223check*/ 
  .get('/stu', liststu)
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
  .get('/post/new', add)
  .get('/post/:id', show)
/*===上面示好的=== */
 
  
  

  
  
  
  

  
  
  /*teacher login */
  
  /* student login*/
  
  /*create post*/
  
  //.get('/post/newstu', addstu) 

  
  //.post('/poststu', createstu)不確定要不要加
   /*del post*/
  
  /*del account*/
  
  //.get('/delaccount_root/:id',delaccount_root)=>該加還是不該加?
  /*edit post*/ 
  
  /*edit account*/ 

  
  
  

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
/*1223check*/ 
async function loginUi(ctx) {
  ctx.response.body = await render.loginUi();
}

/*1223check*/
async function login(ctx) {
  const body = ctx.request.body()
  if (body.type === "form") {
    var user = await parseFormBody(body)
    var dbUsers = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${user.username}'`) // userMap[user.username]
    var dbUser = dbUsers[0]
    var pattern=/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
    if(pattern.test(user.password)||pattern.test(user.username))
    {
      ctx.response.body = render.loginUi({status:'不可輸入特殊符號'})
      return;
    }
    else
    {
      if (dbUser != null && dbUser.password === user.password ) {
        ctx.state.session.set('user', user)
        console.log('session.user=', await ctx.state.session.get('user'))
        ctx.response.redirect('/');
        return;
      }
  
      else 
      {
        ctx.response.body = render.loginUi({status:'這是傳給老師的'})
        return;
      } 

    }
    
   
  }
}

/*1223check*/
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
  var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
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
    
    var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
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
      var dbUsers = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${user.username}'`)
      if (dbUsers.length === 0) 
      {
        sqlcmd("INSERT INTO users_teacher (username, password, email) VALUES (?, ?, ?)", [user.username, user.password, user.email]);
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
    var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
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
    
    var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
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
      var dbUsers = user_studentQuery(`SELECT id, username, password, email FROM users_student WHERE username='${user.username}'`)
      if (dbUsers.length === 0) 
      {
        sqlcmd("INSERT INTO users_student (username, password, email) VALUES (?, ?, ?)", [user.username, user.password, user.email]);
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
 


/*1223check*/
async function logout(ctx) {
   ctx.state.session.set('user', null)
   ctx.response.redirect('/login')
}
/*1223check */
async function list(ctx) {
  var usercheck = await ctx.state.session.get('user')
  if(usercheck==null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
  }
  else if(usercheck!=null)
  {
    var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
    var safes = safe[0]
    if(safes!=null)
    {
      let orderby = ctx.request.url.searchParams.get('orderby')
      orderby = orderby || 'id'
      let op = ctx.request.url.searchParams.get('op')
      op = op || 'ASC'
      
      var posts = postQuery(`SELECT id,username, title, body ,file,content FROM posts ORDER BY ${orderby} ${op}`)
      ctx.response.body = await render.list(posts,safes.email);
    }
    
    else
    {
      ctx.response.body = render.loginUi({status:'請先登入'})
    }
  }
  
}
/*1223check */
async function liststu(ctx) {

  var usercheck = await ctx.state.session.get('user')
  if(usercheck==null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
    return;
  }
  else if(usercheck!=null)
  {
    var safe = user_studentQuery(`SELECT id, username, password, email FROM users_student WHERE username='${usercheck.username}'`)
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
    var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
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
  //console.log("0127跑到這裡?")
  //console.log("0127",form.fields.title)
  const body = ctx.request.body()
  if(usercheck==null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
        return;
  }
  else
  {
    var safe = user_studentQuery(`SELECT id, username, password, email FROM users_student WHERE username='${usercheck.username}'`)
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
        console.log("1226查詢",search.search)
        console.log("1226查詢",search.body)
        console.log("1226查詢",search.title)
        console.log("1226查詢",search.username)
        console.log("1226查詢",search.content)
        if(usercheck != null)
      {
       /* let orderby = ctx.request.url.searchParams.get('orderby')
        orderby = orderby || 'id'
        let op = ctx.request.url.searchParams.get('op')
        op = op || 'ASC'*/
      
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
    var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
    var safes = safe[0]
    if(safes!=null)
    {
      let users = user_studentQuery(`SELECT id,username, password,email FROM users_student `)
      let roots = user_teacherQuery(`SELECT id,username, password,email FROM users_teacher `)
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
    var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
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
    var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
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
    var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
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
  var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
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
    var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
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
    var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
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
  const pid = ctx.params.id;
  var usercheck = await ctx.state.session.get('user')
  if(usercheck == null)
  {
    ctx.response.body = render.loginUi({status:'請先登入'})
    return;
  }
  else
  {
  var root = user_studentQuery(`SELECT id, username, password, email FROM users_student WHERE id='${pid}'`)
  var roots = root[0]

  var safe = user_studentQuery(`SELECT id, username, password, email FROM users_student WHERE username='${usercheck.username}' AND id=${pid}`)
  var safes = safe[0]
  if(safes!=null)
  {

    ctx.response.body = await render.editpassword_userui(safes);
    return;
  }
  else if(roots!=null)
  {
    ctx.response.body = await render.editpassword_user_for_rootui(roots);
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
    var root = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
    var roots = root[0]
  
    var safe = user_studentQuery(`SELECT id, username, password, email FROM users_student WHERE username='${usercheck.username}' AND id=${pid}`)
    var safes = safe[0]

    if(pattern.test(account.password_check)||pattern.test(account.password_new)||pattern.test(account.password_new_check)||account.password_new_check==''||account.password_check==''||account.password_new=='')
    {
      ctx.response.body = await render.editpassword_userui(safes,{status:'不可輸入特殊符號或空白'});
      return;
    }
  if(safes!=null)
  {
    if (body.type === "form"&&safes.password==account.password_check&&account.password_new==account.password_new_check) 
    {
      sqlcmd(`UPDATE users_student SET "password"='${account.password_new}'WHERE id='${pid}';`)
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
    return;}
  }

  else if(roots!=null)
  {
    if (body.type === "form") {
      var account = await parseFormBody(body)
      sqlcmd(`UPDATE users_student SET "password"='${account.password_new}'WHERE id='${pid}';`)
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
  var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
  var safes = safe[0]
  if(safes!=null)
  {
  let users = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE id=${pid}`)
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
  var safe = user_teacherQuery(`SELECT id, username, password, email FROM users_teacher WHERE username='${usercheck.username}'`)
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
  var safe = user_studentQuery(`SELECT id, username, password, email FROM users_student WHERE id='${pid}'`)
  var safes = safe[0]
  if(pattern.test(account.account)||pattern.test(account.password)||pattern.test(account.username)||account.account==''||account.password==''||account.username=='')
    {
      ctx.response.body = await render.editpassword_user_for_rootui(safes,{status:'不可輸入特殊符號或空白'});
      return;
    }
  if(safes!=null)
  {
    if (body.type === "form") {
     
      sqlcmd(`UPDATE users_student SET "username"='${account.account}',"password"='${account.password}',"email"='${account.username}' WHERE id='${pid}';`)
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




console.log('Server run at http://127.0.0.1:8025/login');

await app.listen({port: 8025 });