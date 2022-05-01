import { Application, Router,send } from "https://deno.land/x/oak@v6.5.0/mod.ts";
import * as render from './render.js'
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Session } from "https://deno.land/x/session@1.1.0/mod.ts";
import { multiParser} from 'https://deno.land/x/multiparser@v2.1.0/mod.ts'
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT, username TEXT, date TEXT, file TEXT , content TEXT)");
db.query("CREATE TABLE IF NOT EXISTS users_student (id INTEGER PRIMARY KEY AUTOINCREMENT, account TEXT, password TEXT, username TEXT)");
db.query("CREATE TABLE IF NOT EXISTS users_teacher (id INTEGER PRIMARY KEY AUTOINCREMENT, account TEXT, password TEXT, username TEXT)");

const router = new Router();

router.get('/', list) 
.get('/mechanism',mechanism)

.get('/home', homeUi)//V
.get('/about', aboutUi)
 // .get('/stu', liststu)
  .get('/signup_teacher', signup_teacherUi)
  .post('/signup_teacher', signup_teacher)
  .get('/signup_student', signup_studentUi)
  .post('/signup_student', signup_student)
  .get('/login', middle)
  .post('/login', login)
  .get('/loginstu', middle)
 // .post('/loginstu', loginstu)
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
  
  .post('/list_graduate', list_graduate)
  .get('/list_graduate', list_graduate)
  .post('/list_graduate_custom', list_graduate_custom)
  .get('/list_graduate_custom', list_graduate_custom)
  .post('/list_graduate_custom_root', list_graduate_custom_root)
  .get('/list_graduate_custom_root', list_graduate_custom_root)
  .get('/post/new', add)
  .get('/post/:id', show)
  //根本就不知道在找什麼==
  .get('/mechanism_kl',mechanism_kl)
  .get('/mechanism_t',mechanism_t)
  .get('/mechanism_nt',mechanism_nt)
  .get('/mechanism_tu',mechanism_tu)
  .get('/mechanism_s',mechanism_s)
  .get('/mechanism_ss',mechanism_ss)
  .get('/mechanism_m',mechanism_m)
  .get('/mechanism_tc',mechanism_tc)
  .get('/mechanism_ch',mechanism_ch)
  .get('/mechanism_u',mechanism_u)
  .get('/mechanism_c',mechanism_c)
  .get('/mechanism_tn',mechanism_tn)
  .get('/mechanism_kh',mechanism_kh)
  .get('/mechanism_pt',mechanism_pt)
  .get('/mechanism_tt',mechanism_tt)
  .get('/mechanism_h',mechanism_h)
  .get('/mechanism_y',mechanism_y)
  .get('/mechanism_n',mechanism_n)
  .get('/mechanism_p',mechanism_p)
  .get('/mechanism_k',mechanism_k)
  .get('/mechanism_l',mechanism_l)
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
  for (const [id, username, title, date,file,content] of sqlcmd(sql)) {
    list.push({id, username, title, date,file,content})
    
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
async function middle(ctx) {
  var user = await ctx.state.session.get('user')
  ctx.response.body = await render.middle(user);
}

async function homeUi(ctx) {
  var usercheck = await ctx.state.session.get('user')
  if(usercheck==undefined)
    ctx.response.body = await render.homeUi()
  else if (usercheck!=undefined)
    ctx.response.body = await render.homeUi(usercheck);  
    return;
}





async function aboutUi(ctx) {
  var usercheck = await ctx.state.session.get('user')
  if(usercheck==undefined)
  {
    ctx.response.body = await render.aboutUi()
  }
  else
  {
    ctx.response.body = await render.aboutUi(usercheck);
   /* var safe = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${user.username}'`)
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
    }*/
    
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

      //管理者
      if (roots != null &&roots.password === input.password) {
        ctx.state.session.set('user', roots)
        //ctx.response.redirect('/list_graduate');
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
        ctx.response.body = render.middle({status:'帳號或密碼錯誤'},usercheck);
        return;
      }
  }
}

/*1223check*/
/*async function loginstu(ctx) {
  const body = ctx.request.body()
  if (body.type === "form") {
    var user = await parseFormBody(body)
    var dbUsers = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${user.username}'`) // userMap[user.username]
    var dbUser = dbUsers[0]
    var pattern=/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
    if(pattern.test(user.password)||pattern.test(user.username))
    {
      ctx.response.body = render.middle({status:'不可輸入特殊符號'})
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
        ctx.response.body = render.middle({status:'這是傳給學生的'})
        return;
      } 

    }
   
  }
}*/


/*signup teacher */
/*1223check*/
async function signup_teacherUi(ctx) {
  var usercheck = await ctx.state.session.get('user')
  if(usercheck==null)
  {
    ctx.response.body = render.middle({status:'請先登入'})
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
      ctx.response.body = render.middle({status:'請先登入'})
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
    ctx.response.body = render.middle({status:'請先登入'})
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
        ctx.response.body = render.middle({status:'帳號創立成功，請重新登入'})
      } 
      else
      {
        ctx.response.body = render.signup_teacherUi({status:'帳號已被創立'})
      }
      
      }
    }
    else
    {
      ctx.response.body = render.middle({status:'請先登入'})
    }

  }
}
 
/*signup student */
/*1223check*/ 
async function signup_studentUi(ctx) {
  var usercheck = await ctx.state.session.get('user')
  if(usercheck == null)
  {
    ctx.response.body = render.middle({status:'請先登入'})
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
      ctx.response.body = render.middle({status:'請先登入'})
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
    ctx.response.body = render.middle({status:'請先登入'})
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
        ctx.response.body = render.middle({status:'帳號創立成功，請重新登入'})
      } 
      else
      {
        ctx.response.body = render.signup_studentUi({status:'帳號已被創立'})
      }
      
      }
    }
    else
    {
      ctx.response.body = render.middle({status:'請先登入'})
    }

  }
}
 
//
async function mechanism(ctx) {
  var usercheck = await ctx.state.session.get('user')
  if(usercheck==null)
  {
    ctx.response.body = render.middle({status:'請先登入'},usercheck);
  }
  else if(usercheck!=null)
  {
    var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`) // userMap[user.username]
    var roots = root[0]
    var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
    var users = user[0]

    let orderby = ctx.request.url.searchParams.get('orderby')
    orderby = orderby || 'id'
    let op = ctx.request.url.searchParams.get('op')
    op = op || 'ASC'
      
    var posts = postQuery(`select id, username, title, date,file,content from posts WHERE(title LIKE '%金門縣%') AND (date LIKE '%實習%') group by title `)
    ctx.response.body = await render.mechanism(posts,usercheck.username);
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
  if(usercheck==null)
    ctx.response.body = render.middle({status:'請先登入'},usercheck);
  else if(usercheck!=null)
  {
    var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`) // userMap[user.username]
    var roots = root[0]
    var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
    var users = user[0]
    let orderby = ctx.request.url.searchParams.get('orderby')
    orderby = orderby || 'id'
    let op = ctx.request.url.searchParams.get('op')
    op = op || 'ASC'
    var posts = postQuery(`SELECT id,username, title, date ,file,content FROM posts WHERE date LIKE '%實習%';`) 
    if(roots!=null)
    ctx.response.body = await render.list(posts,usercheck);
    else if(users!=null)
    ctx.response.body = await render.liststu(posts,usercheck);
    }

  }

async function list_custom(ctx) {
    var usercheck = await ctx.state.session.get('user')
    const body = ctx.request.body()
    if(usercheck==null)
    {
      ctx.response.body = render.middle({status:'請先登入'},user)
      return;
    }
    else
    {
      var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`)
      var roots = root[0]
      if(roots==null)
      {
        ctx.response.body = render.middle({status:'請先登入'},user)
      return;
      }
      else
      {
        if (body.type === "form") { 
          var search = await parseFormBody(body)
          console.log("看search點了哪些",search)
          var user = await ctx.state.session.get('user')
          var see=search.search.split(" ")
          var contents=search.contents
          var date= search.date
          var str = ''
          var str_condition = ''
          var i=0
          var patten=[] 
         if(contents!="dis")
        {
          str_condition=str_condition+"AND content LIKE '%" + contents+ "%' " 
        }
         if(date!="dis")
         {
          str_condition=str_condition+"AND date LIKE '%" + date+ "%' "
         } 
         
        if(search.title!=null)
         {
          while(see[i]!=null)
          { 
            str=str+"OR title LIKE '%" + see[i]+ "%' " 
           i++;
          }  
          
          }

        if(search.username!=null)
          {
            i=0
            while(see[i]!=null)
            { 
             str=str+"OR username LIKE '%" + see[i]+ "%' " 
             i++;
            }  
          }

        if(search.content!=null)
        {
          i=0
          while(see[i]!=null)
          { 
           str=str+"OR content LIKE '%" + see[i]+ "%' " 
           i++;
          }  
           
           
        }

        if((search.search!="")&&(search.title==undefined)&&(search.username==undefined)&&(search.content==undefined)&&(contents=="dis")&&(date=="dis")) {
         console.log("進來這裡代表隨便找")
          i=0
          while(see[i]!=null)
          { 
           str=str+"OR title LIKE '%" + see[i]+ "%' OR content LIKE '%"+see[i]+ "%' OR username LIKE '%"+see[i]+  "%' OR date LIKE '%" +see[i]+"%'" 
           i++;
          }        
          }

          if((search.search!="")&&((contents!="dis")||(date!="dis"))) {
            console.log("有做條件選取，但是沒有精準，而且有搜尋")
            i=0
            while(see[i]!=null)
            { 
             str=str+"OR title LIKE '%" + see[i]+ "%' OR content LIKE '%"+see[i]+ "%' OR username LIKE '%"+see[i]+  "%' OR date LIKE '%" +see[i]+"%'" 
             i++;
            } 
            var posts = postQuery(`SELECT id,username, title, date ,file,content FROM posts WHERE (date LIKE '%實習%') ${str_condition}  AND (username LIKE '%eggwu好帥%'${str}) ORDER BY id DESC ;`) 
          }
  
          
         if(str_condition=="")
         {
          var posts = postQuery(`SELECT id,username, title, date ,file,content FROM posts WHERE (date LIKE '%實習%') AND (username LIKE '%eggwu好帥%'${str}) ORDER BY id DESC ;`) 
          console.log("跑1") 
        }
          if(str_condition!=""&&str=="")
         {
          var posts = postQuery(`SELECT id,username, title, date ,file,content FROM posts WHERE (date LIKE '%實習%') ${str_condition}  ORDER BY id DESC ;`) 
          console.log("跑2",str)
         }
          
         if(str_condition!=""&&str!="")
          {
            var posts = postQuery(`SELECT id,username, title, date ,file,content FROM posts WHERE (date LIKE '%實習%') ${str_condition}  AND (username LIKE '%eggwu好帥%'${str}) ORDER BY id DESC ;`) 
            console.log("跑3")
          }
          ctx.response.body = await render.list(posts,usercheck);
          return;
          
        }
      }
    }
      
    }
  
  

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
        var root = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
        var roots = root[0]
        if(roots==null)
        {
          ctx.response.body = render.middle({status:'請先登入'},user)
        return;
        }
        else
        {
          if (body.type === "form") { 
            var search = await parseFormBody(body)
            console.log("看search點了哪些",search)
            var user = await ctx.state.session.get('user')
            var see=search.search.split(" ")
            var contents=search.contents
            var date= search.date
            var str = ''
            var str_condition = ''
            var i=0
            var patten=[] 
           if(contents!="dis")
          {
            str_condition=str_condition+"AND content LIKE '%" + contents+ "%' " 
          }
           if(date!="dis")
           {
            str_condition=str_condition+"AND date LIKE '%" + date+ "%' "
           } 
           
          if(search.title!=null)
           {
            while(see[i]!=null)
            { 
              str=str+"OR title LIKE '%" + see[i]+ "%' " 
             i++;
            }  
            
            }
  
          if(search.username!=null)
            {
              i=0
              while(see[i]!=null)
              { 
               str=str+"OR username LIKE '%" + see[i]+ "%' " 
               i++;
              }  
            }
  
          if(search.content!=null)
          {
            i=0
            while(see[i]!=null)
            { 
             str=str+"OR content LIKE '%" + see[i]+ "%' " 
             i++;
            }  
             
             
          }
  
          if((search.search!="")&&(search.title==undefined)&&(search.username==undefined)&&(search.content==undefined)&&(contents=="dis")&&(date=="dis")) {
           console.log("進來這裡代表隨便找")
            i=0
            while(see[i]!=null)
            { 
             str=str+"OR title LIKE '%" + see[i]+ "%' OR content LIKE '%"+see[i]+ "%' OR username LIKE '%"+see[i]+  "%' OR date LIKE '%" +see[i]+"%'" 
             i++;
            }        
            }
  
            if((search.search!="")&&((contents!="dis")||(date!="dis"))) {
              console.log("有做條件選取，但是沒有精準，而且有搜尋")
              i=0
              while(see[i]!=null)
              { 
               str=str+"OR title LIKE '%" + see[i]+ "%' OR content LIKE '%"+see[i]+ "%' OR username LIKE '%"+see[i]+  "%' OR date LIKE '%" +see[i]+"%'" 
               i++;
              } 
              var posts = postQuery(`SELECT id,username, title, date ,file,content FROM posts WHERE (date LIKE '%實習%') ${str_condition}  AND (username LIKE '%eggwu好帥%'${str}) ORDER BY id DESC ;`) 
            }
    
            
           if(str_condition=="")
           {
            var posts = postQuery(`SELECT id,username, title, date ,file,content FROM posts WHERE (date LIKE '%實習%') AND (username LIKE '%eggwu好帥%'${str}) ORDER BY id DESC ;`) 
            console.log("跑1") 
          }
            if(str_condition!=""&&str=="")
           {
            var posts = postQuery(`SELECT id,username, title, date ,file,content FROM posts WHERE (date LIKE '%實習%') ${str_condition}  ORDER BY id DESC ;`) 
            console.log("跑2",str)
           }
            
           if(str_condition!=""&&str!="")
            {
              var posts = postQuery(`SELECT id,username, title, date ,file,content FROM posts WHERE (date LIKE '%實習%') ${str_condition}  AND (username LIKE '%eggwu好帥%'${str}) ORDER BY id DESC ;`) 
              console.log("跑3")
            }
            ctx.response.body = await render.liststu(posts,usercheck);
            return;
            
          }
        }
      }
        
      }   


async function list_graduate(ctx) {
    var usercheck = await ctx.state.session.get('user')
      if(usercheck==undefined)
      {
        ctx.response.body = render.middle({status:'請先登入'})
        return;
      }
      else{
        var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`)
        var roots = root[0]
        var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
        var users = user[0]
        var posts = postQuery(`SELECT id,username, title, date ,file,content FROM posts WHERE date LIKE '%畢業專題%';`) 
        if(roots!=null)
          ctx.response.body = await render.list_graduate_teacher(posts,roots);
        else if(users!=null)
          ctx.response.body = await render.list_graduate_student(posts,users);
        else
        ctx.response.body = render.middle({status:'發生未知錯誤'})
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
      ctx.response.body = render.middle({status:'請先登入'})
    }
  }
  
}*/
/*async function liststu(ctx) {
 var usercheck = await ctx.state.session.get('user')
  if(usercheck==null)
  {
    ctx.response.body = render.middle({status:'請先登入'})
  }
  else if(usercheck!=null)
  {
   /* var safe = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
    var safes = safe[0]
      let orderby = ctx.request.url.searchParams.get('orderby')
      orderby = orderby || 'id'
      let op = ctx.request.url.searchParams.get('op')
      op = op || 'ASC'
      var posts = postQuery(`SELECT id,username, title, body ,file,content FROM posts ORDER BY ${orderby} ${op}`)
      ctx.response.body = await render.liststu(posts,usercheck.username);
     return;
  }
  
}*/


async function list_graduate_custom_root(ctx) {
  var usercheck = await ctx.state.session.get('user')
  const body = ctx.request.body()
  if(usercheck==null)
  {
    ctx.response.body = render.middle({status:'請先登入'},user)
    return;
  }
  else
  {
    var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`)
    var roots = root[0]
    if(roots==null)
    {
      ctx.response.body = render.middle({status:'請先登入'},user)
    return;
    }
    else
    {
      if (body.type === "form") { 
        var search = await parseFormBody(body)
        console.log("看search點了哪些",search)
        var user = await ctx.state.session.get('user')
        var see=search.search.split(" ")
        var contents=search.contents
        var date= search.date
        var str = ''
        var str_condition = ''
        var i=0
        var patten=[] 
       if(contents!="dis")
      {
        str_condition=str_condition+"AND content LIKE '%" + contents+ "%' " 
      }
       if(date!="dis")
       {
        str_condition=str_condition+"AND date LIKE '%" + date+ "%' "
       } 
       
      if(search.title!=null)
       {
        while(see[i]!=null)
        { 
          str=str+"OR title LIKE '%" + see[i]+ "%' " 
         i++;
        }  
        
        }

      if(search.username!=null)
        {
          i=0
          while(see[i]!=null)
          { 
           str=str+"OR username LIKE '%" + see[i]+ "%' " 
           i++;
          }  
        }

      if(search.content!=null)
      {
        i=0
        while(see[i]!=null)
        { 
         str=str+"OR content LIKE '%" + see[i]+ "%' " 
         i++;
        }  
         
         
      }

      if((search.search!="")&&(search.title==undefined)&&(search.username==undefined)&&(search.content==undefined)&&(contents=="dis")&&(date=="dis")) {
       console.log("進來這裡代表隨便找")
        i=0
        while(see[i]!=null)
        { 
         str=str+"OR title LIKE '%" + see[i]+ "%' OR content LIKE '%"+see[i]+ "%' OR username LIKE '%"+see[i]+  "%' OR date LIKE '%" +see[i]+"%'" 
         i++;
        }        
        }

        if((search.search!="")&&((contents!="dis")||(date!="dis"))) {
          console.log("有做條件選取，但是沒有精準，而且有搜尋")
          i=0
          while(see[i]!=null)
          { 
           str=str+"OR title LIKE '%" + see[i]+ "%' OR content LIKE '%"+see[i]+ "%' OR username LIKE '%"+see[i]+  "%' OR date LIKE '%" +see[i]+"%'" 
           i++;
          } 
          var posts = postQuery(`SELECT id,username, title, date ,file,content FROM posts WHERE (date LIKE '%專題%') ${str_condition}  AND (username LIKE '%eggwu好帥%'${str}) ORDER BY id DESC ;`) 
        }

        
       if(str_condition=="")
       {
        var posts = postQuery(`SELECT id,username, title, date ,file,content FROM posts WHERE (date LIKE '%專題%') AND (username LIKE '%eggwu好帥%'${str}) ORDER BY id DESC ;`) 
        console.log("跑1") 
      }
        if(str_condition!=""&&str=="")
       {
        var posts = postQuery(`SELECT id,username, title, date ,file,content FROM posts WHERE (date LIKE '%專題%') ${str_condition}  ORDER BY id DESC ;`) 
        console.log("跑2",str)
       }
        
       if(str_condition!=""&&str!="")
        {
          var posts = postQuery(`SELECT id,username, title, date ,file,content FROM posts WHERE (date LIKE '%專題%') ${str_condition}  AND (username LIKE '%eggwu好帥%'${str}) ORDER BY id DESC ;`) 
          console.log("跑3")
        }
        ctx.response.body = await render.list(posts,usercheck);
       return;
        
      }
    }
  }
    
  }


async function list_graduate_custom(ctx) {
      var usercheck = await ctx.state.session.get('user')
      const body = ctx.request.body()
      if(usercheck==null)
      {
        ctx.response.body = render.middle({status:'請先登入'},user)
        return;
      }
      else
      {
        var root = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
        var roots = root[0]
        if(roots==null)
        {
          ctx.response.body = render.middle({status:'請先登入'},user)
        return;
        }
        else
        {
          if (body.type === "form") { 
            var search = await parseFormBody(body)
            console.log("看search點了哪些",search)
            var user = await ctx.state.session.get('user')
            var see=search.search.split(" ")
            var contents=search.contents
            var date= search.date
            var str = ''
            var str_condition = ''
            var i=0
            var patten=[] 
           if(contents!="dis")
          {
            str_condition=str_condition+"AND content LIKE '%" + contents+ "%' " 
          }
           if(date!="dis")
           {
            str_condition=str_condition+"AND date LIKE '%" + date+ "%' "
           } 
           
          if(search.title!=null)
           {
            while(see[i]!=null)
            { 
              str=str+"OR title LIKE '%" + see[i]+ "%' " 
             i++;
            }  
            
            }
  
          if(search.username!=null)
            {
              i=0
              while(see[i]!=null)
              { 
               str=str+"OR username LIKE '%" + see[i]+ "%' " 
               i++;
              }  
            }
  
          if(search.content!=null)
          {
            i=0
            while(see[i]!=null)
            { 
             str=str+"OR content LIKE '%" + see[i]+ "%' " 
             i++;
            }  
             
             
          }
  
          if((search.search!="")&&(search.title==undefined)&&(search.username==undefined)&&(search.content==undefined)&&(contents=="dis")&&(date=="dis")) {
           console.log("進來這裡代表隨便找")
            i=0
            while(see[i]!=null)
            { 
             str=str+"OR title LIKE '%" + see[i]+ "%' OR content LIKE '%"+see[i]+ "%' OR username LIKE '%"+see[i]+  "%' OR date LIKE '%" +see[i]+"%'" 
             i++;
            }        
            }
  
            if((search.search!="")&&((contents!="dis")||(date!="dis"))) {
              console.log("有做條件選取，但是沒有精準，而且有搜尋")
              i=0
              while(see[i]!=null)
              { 
               str=str+"OR title LIKE '%" + see[i]+ "%' OR content LIKE '%"+see[i]+ "%' OR username LIKE '%"+see[i]+  "%' OR date LIKE '%" +see[i]+"%'" 
               i++;
              } 
              var posts = postQuery(`SELECT id,username, title, date ,file,content FROM posts WHERE (date LIKE '%專題%') ${str_condition}  AND (username LIKE '%eggwu好帥%'${str}) ORDER BY id DESC ;`) 
            }
    
            
           if(str_condition=="")
           {
            var posts = postQuery(`SELECT id,username, title, date ,file,content FROM posts WHERE (date LIKE '%專題%') AND (username LIKE '%eggwu好帥%'${str}) ORDER BY id DESC ;`) 
            console.log("跑1") 
          }
            if(str_condition!=""&&str=="")
           {
            var posts = postQuery(`SELECT id,username, title, date ,file,content FROM posts WHERE (date LIKE '%專題%') ${str_condition}  ORDER BY id DESC ;`) 
            console.log("跑2",str)
           }
            
           if(str_condition!=""&&str!="")
            {
              var posts = postQuery(`SELECT id,username, title, date ,file,content FROM posts WHERE (date LIKE '%專題%') ${str_condition}  AND (username LIKE '%eggwu好帥%'${str}) ORDER BY id DESC ;`) 
              console.log("跑3")
            }
            ctx.response.body = await render.liststu(posts,usercheck);
          return;
            
          }
        }
      }
        
      }  
    
/*1223check*/ 
async function editaccount(ctx) {
  var usercheck = await ctx.state.session.get('user')
  if(usercheck==null)
  {
    ctx.response.body = render.middle({status:'請先登入'})
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
      ctx.response.body = render.middle({status:'請先登入'})
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
      ctx.response.body = render.middle({status:'請先登入'})
    return;
    }
    else
    {
      ctx.response.body = await render.newPost();
      return;
    }
    
  } 
  else {
    ctx.response.body = render.middle({status:'請先登入'})
    return;
  }
  
}

/*async function addstu(ctx) {
  var user = await ctx.state.session.get('user')
  if (user != null) {
    ctx.response.body = await render.newPoststu();
  } else {
    ctx.response.body = render.middle({status:'請先登入'})
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
      ctx.response.body = render.middle({status:'請先登入'})
      return;
    }
    
  }
    
  else
  {
    ctx.response.body = render.middle({status:'請先登入'})
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
    ctx.response.body = render.middle({status:'請先登入'})
    return;
    }

  }
    
  else
  {
    ctx.response.body = render.middle({status:'請先登入'})
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
    ctx.response.body = render.middle({status:'請先登入'})
    //ctx.response.redirect('/login');
  }

  
  
}*/

//1223check
async function editpostui(ctx) {
 
  var usercheck = await ctx.state.session.get('user')
  if(usercheck==null)
  {
    ctx.response.body = render.middle({status:'請先登入'})
    return;

  }
  else{
    var safe = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`)
    var safes = safe[0]
    if(safes!=null)
    {
    const pid = ctx.params.id;
    let posts = postQuery(`SELECT id, username, title, date,file,content FROM posts WHERE id=${pid}`)
    let post = posts[0]
    if (!post) ctx.throw(404, 'invalid post id');
    ctx.response.body = await render.editpostui(post);
    return;
    }

    else 
    {
      ctx.response.body = render.middle({status:'請先登入'})
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
    ctx.response.body = render.middle({status:'請先登入'})
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
      let posts = postQuery(`SELECT id, username, title, date,file,content FROM posts WHERE id=${pid}`)
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
      
        if( form.fields.title==''|| form.fields.date==''||form.fields.content=='')
        {
          ctx.response.body = await render.editpostui(post,{status:'不可空白'});
          return;
        }
    
        if(pattern.test(form.fields.title)||pattern_only.test(form.fields.date)||pattern.test(form.fields.content))
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
        sqlcmd(`UPDATE posts SET "username"='${form.fields.author}',"title"='${form.fields.title}',"date"='${year}',"file"='${filename}',"content"='${content}'WHERE id='${pid}';`)
        ctx.response.redirect('/');
      return;
    }
    else
    {
      ctx.response.body = render.middle({status:'請先登入'})
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
    ctx.response.body = render.middle({status:'請先登入'})
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
    ctx.response.body = render.middle({status:'請先登入'})
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
      ctx.response.body = render.middle({status:'修改成功'})
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
      ctx.response.body = render.middle({status:'修改成功'})
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
    ctx.response.body = render.middle({status:'請先登入'})
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
    ctx.response.body = render.middle({status:'請先登入'})
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
    ctx.response.body = render.middle({status:'請先登入'})
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
    ctx.response.body = render.middle({status:'請先登入'})
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
    ctx.response.body = render.middle({status:'請先登入'})
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
    ctx.response.body = render.middle({status:'請先登入'})
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
    ctx.response.body = render.middle({status:'請先登入'})
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
  
    if( form.fields.title==''|| form.fields.date==''||form.fields.content=='')
    {
      ctx.response.body = await render.newPost({status:'不可空白'});
      return;
    }

    if(pattern.test(form.fields.title)||pattern_only.test(form.fields.date)||pattern.test(form.fields.content))
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
      sqlcmd("INSERT INTO posts (username, title, date,file,content) VALUES (?, ?, ?,?,?)", [form.fields.author, form.fields.title, year,filename,content]);
    } 
    else {
      ctx.throw(404, 'not login yet!');
    }
    ctx.response.redirect('/');



}

/*1223check */
async function show(ctx) {
  const pid = ctx.params.id;
  let posts = postQuery(`SELECT id, username, title, date,file,content FROM posts WHERE id=${pid}`)
  let post = posts[0]
  if (!post) ctx.throw(404, 'invalid post id');
  ctx.response.body = await render.show(post);
}
async function mechanism_kl(ctx) {
  var usercheck = await ctx.state.session.get('user')
  if(usercheck==null)
  {
    ctx.response.body = render.middle({status:'請先登入'},usercheck);
  }
  else if(usercheck!=null)
  {
    var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`) // userMap[user.username]
    var roots = root[0]
    var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
    var users = user[0]

    let orderby = ctx.request.url.searchParams.get('orderby')
    orderby = orderby || 'id'
    let op = ctx.request.url.searchParams.get('op')
    op = op || 'ASC'
      
    var posts = postQuery(`select id, username, title, date,file,content from posts WHERE(title LIKE '%基隆%') AND (date LIKE '%實習%') group by title `)
    ctx.response.body = await render.mechanism(posts,usercheck.username);
    }

  }
async function mechanism_t(ctx) {
    var usercheck = await ctx.state.session.get('user')
    if(usercheck==null)
    {
      ctx.response.body = render.middle({status:'請先登入'},usercheck);
    }
    else if(usercheck!=null)
    {
      var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`) // userMap[user.username]
      var roots = root[0]
      var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
      var users = user[0]
  
      let orderby = ctx.request.url.searchParams.get('orderby')
      orderby = orderby || 'id'
      let op = ctx.request.url.searchParams.get('op')
      op = op || 'ASC'
        
      var posts = postQuery(`select id, username, title, date,file,content from posts WHERE(title LIKE '%台北%') AND (date LIKE '%實習%') group by title `)
      ctx.response.body = await render.mechanism(posts,usercheck.username);
      }
  
    }
async function mechanism_nt(ctx) {
      var usercheck = await ctx.state.session.get('user')
      if(usercheck==null)
      {
        ctx.response.body = render.middle({status:'請先登入'},usercheck);
      }
      else if(usercheck!=null)
      {
        var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`) // userMap[user.username]
        var roots = root[0]
        var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
        var users = user[0]
    
        let orderby = ctx.request.url.searchParams.get('orderby')
        orderby = orderby || 'id'
        let op = ctx.request.url.searchParams.get('op')
        op = op || 'ASC'
          
        var posts = postQuery(`select id, username, title, date,file,content from posts WHERE(title LIKE '%新北%') AND (date LIKE '%實習%') group by title `)
        ctx.response.body = await render.mechanism(posts,usercheck.username);
        }
    
      }
async function mechanism_tu(ctx) {
        var usercheck = await ctx.state.session.get('user')
        if(usercheck==null)
        {
          ctx.response.body = render.middle({status:'請先登入'},usercheck);
        }
        else if(usercheck!=null)
        {
          var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`) // userMap[user.username]
          var roots = root[0]
          var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
          var users = user[0]
      
          let orderby = ctx.request.url.searchParams.get('orderby')
          orderby = orderby || 'id'
          let op = ctx.request.url.searchParams.get('op')
          op = op || 'ASC'
            
          var posts = postQuery(`select id, username, title, date,file,content from posts WHERE(title LIKE '%桃園%') AND (date LIKE '%實習%') group by title `)
          ctx.response.body = await render.mechanism(posts,usercheck.username);
          }
      
        }
async function mechanism_s(ctx) {
          var usercheck = await ctx.state.session.get('user')
          if(usercheck==null)
          {
            ctx.response.body = render.middle({status:'請先登入'},usercheck);
          }
          else if(usercheck!=null)
          {
            var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`) // userMap[user.username]
            var roots = root[0]
            var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
            var users = user[0]
        
            let orderby = ctx.request.url.searchParams.get('orderby')
            orderby = orderby || 'id'
            let op = ctx.request.url.searchParams.get('op')
            op = op || 'ASC'
              
            var posts = postQuery(`select id, username, title, date,file,content from posts WHERE(title LIKE '%新竹縣%') AND (date LIKE '%實習%') group by title `)
            ctx.response.body = await render.mechanism(posts,usercheck.username);
            }
        
          }
async function mechanism_ss(ctx) {
            var usercheck = await ctx.state.session.get('user')
            if(usercheck==null)
            {
              ctx.response.body = render.middle({status:'請先登入'},usercheck);
            }
            else if(usercheck!=null)
            {
              var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`) // userMap[user.username]
              var roots = root[0]
              var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
              var users = user[0]
          
              let orderby = ctx.request.url.searchParams.get('orderby')
              orderby = orderby || 'id'
              let op = ctx.request.url.searchParams.get('op')
              op = op || 'ASC'
                
              var posts = postQuery(`select id, username, title, date,file,content from posts WHERE(title LIKE '%新竹縣%') AND (date LIKE '%實習%') group by title `)
              ctx.response.body = await render.mechanism(posts,usercheck.username);
              }
          
            }
async function mechanism_m(ctx) {
              var usercheck = await ctx.state.session.get('user')
              if(usercheck==null)
              {
                ctx.response.body = render.middle({status:'請先登入'},usercheck);
              }
              else if(usercheck!=null)
              {
                var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`) // userMap[user.username]
                var roots = root[0]
                var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
                var users = user[0]
            
                let orderby = ctx.request.url.searchParams.get('orderby')
                orderby = orderby || 'id'
                let op = ctx.request.url.searchParams.get('op')
                op = op || 'ASC'
                  
                var posts = postQuery(`select id, username, title, date,file,content from posts WHERE(title LIKE '%苗栗%') AND (date LIKE '%實習%') group by title `)
                ctx.response.body = await render.mechanism(posts,usercheck.username);
                }
            
              }
async function mechanism_tc(ctx) {
                var usercheck = await ctx.state.session.get('user')
                if(usercheck==null)
                {
                  ctx.response.body = render.middle({status:'請先登入'},usercheck);
                }
                else if(usercheck!=null)
                {
                  var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`) // userMap[user.username]
                  var roots = root[0]
                  var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
                  var users = user[0]
              
                  let orderby = ctx.request.url.searchParams.get('orderby')
                  orderby = orderby || 'id'
                  let op = ctx.request.url.searchParams.get('op')
                  op = op || 'ASC'
                    
                  var posts = postQuery(`select id, username, title, date,file,content from posts WHERE(title LIKE '%台中%') AND (date LIKE '%實習%') group by title `)
                  ctx.response.body = await render.mechanism(posts,usercheck.username);
                  }
              
                }
async function mechanism_ch(ctx) {
                  var usercheck = await ctx.state.session.get('user')
                  if(usercheck==null)
                  {
                    ctx.response.body = render.middle({status:'請先登入'},usercheck);
                  }
                  else if(usercheck!=null)
                  {
                    var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`) // userMap[user.username]
                    var roots = root[0]
                    var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
                    var users = user[0]
                
                    let orderby = ctx.request.url.searchParams.get('orderby')
                    orderby = orderby || 'id'
                    let op = ctx.request.url.searchParams.get('op')
                    op = op || 'ASC'
                      
                    var posts = postQuery(`select id, username, title, date,file,content from posts WHERE(title LIKE '%彰化%') AND (date LIKE '%實習%') group by title `)
                    ctx.response.body = await render.mechanism(posts,usercheck.username);
                    }
                
                  }
async function mechanism_u(ctx) {
                    var usercheck = await ctx.state.session.get('user')
                    if(usercheck==null)
                    {
                      ctx.response.body = render.middle({status:'請先登入'},usercheck);
                    }
                    else if(usercheck!=null)
                    {
                      var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`) // userMap[user.username]
                      var roots = root[0]
                      var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
                      var users = user[0]
                  
                      let orderby = ctx.request.url.searchParams.get('orderby')
                      orderby = orderby || 'id'
                      let op = ctx.request.url.searchParams.get('op')
                      op = op || 'ASC'
                        
                      var posts = postQuery(`select id, username, title, date,file,content from posts WHERE(title LIKE '%雲林%') AND (date LIKE '%實習%') group by title `)
                      ctx.response.body = await render.mechanism(posts,usercheck.username);
                      }
                  
                    }
async function mechanism_c(ctx) {
                      var usercheck = await ctx.state.session.get('user')
                      if(usercheck==null)
                      {
                        ctx.response.body = render.middle({status:'請先登入'},usercheck);
                      }
                      else if(usercheck!=null)
                      {
                        var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`) // userMap[user.username]
                        var roots = root[0]
                        var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
                        var users = user[0]
                    
                        let orderby = ctx.request.url.searchParams.get('orderby')
                        orderby = orderby || 'id'
                        let op = ctx.request.url.searchParams.get('op')
                        op = op || 'ASC'
                          
                        var posts = postQuery(`select id, username, title, date,file,content from posts WHERE(title LIKE '%嘉義%') AND (date LIKE '%實習%') group by title `)
                        ctx.response.body = await render.mechanism(posts,usercheck.username);
                        }
                    
                      }
async function mechanism_tn(ctx) {
                        var usercheck = await ctx.state.session.get('user')
                        if(usercheck==null)
                        {
                          ctx.response.body = render.middle({status:'請先登入'},usercheck);
                        }
                        else if(usercheck!=null)
                        {
                          var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`) // userMap[user.username]
                          var roots = root[0]
                          var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
                          var users = user[0]
                      
                          let orderby = ctx.request.url.searchParams.get('orderby')
                          orderby = orderby || 'id'
                          let op = ctx.request.url.searchParams.get('op')
                          op = op || 'ASC'
                            
                          var posts = postQuery(`select id, username, title, date,file,content from posts WHERE(title LIKE '%台南%') AND (date LIKE '%實習%') group by title `)
                          ctx.response.body = await render.mechanism(posts,usercheck.username);
                          }
                      
                        }
async function mechanism_kh(ctx) {
                          var usercheck = await ctx.state.session.get('user')
                          if(usercheck==null)
                          {
                            ctx.response.body = render.middle({status:'請先登入'},usercheck);
                          }
                          else if(usercheck!=null)
                          {
                            var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`) // userMap[user.username]
                            var roots = root[0]
                            var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
                            var users = user[0]
                        
                            let orderby = ctx.request.url.searchParams.get('orderby')
                            orderby = orderby || 'id'
                            let op = ctx.request.url.searchParams.get('op')
                            op = op || 'ASC'
                              
                            var posts = postQuery(`select id, username, title, date,file,content from posts WHERE(title LIKE '%高雄%') AND (date LIKE '%實習%') group by title `)
                            ctx.response.body = await render.mechanism(posts,usercheck.username);
                            }
                        
                          }
async function mechanism_pt(ctx) {
                            var usercheck = await ctx.state.session.get('user')
                            if(usercheck==null)
                            {
                              ctx.response.body = render.middle({status:'請先登入'},usercheck);
                            }
                            else if(usercheck!=null)
                            {
                              var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`) // userMap[user.username]
                              var roots = root[0]
                              var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
                              var users = user[0]
                          
                              let orderby = ctx.request.url.searchParams.get('orderby')
                              orderby = orderby || 'id'
                              let op = ctx.request.url.searchParams.get('op')
                              op = op || 'ASC'
                                
                              var posts = postQuery(`select id, username, title,date,file,content from posts WHERE(title LIKE '%屏東%') AND (date LIKE '%實習%') group by title `)
                              ctx.response.body = await render.mechanism(posts,usercheck.username);
                              }
                          
                            }
async function mechanism_tt(ctx) {
                              var usercheck = await ctx.state.session.get('user')
                              if(usercheck==null)
                              {
                                ctx.response.body = render.middle({status:'請先登入'},usercheck);
                              }
                              else if(usercheck!=null)
                              {
                                var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`) // userMap[user.username]
                                var roots = root[0]
                                var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
                                var users = user[0]
                            
                                let orderby = ctx.request.url.searchParams.get('orderby')
                                orderby = orderby || 'id'
                                let op = ctx.request.url.searchParams.get('op')
                                op = op || 'ASC'
                                  
                                var posts = postQuery(`select id, username, title, date,file,content from posts WHERE(title LIKE '%台東%') AND (date LIKE '%實習%') group by title `)
                                ctx.response.body = await render.mechanism(posts,usercheck.username);
                                }
                            
                              }
async function mechanism_h(ctx) {
                                var usercheck = await ctx.state.session.get('user')
                                if(usercheck==null)
                                {
                                  ctx.response.body = render.middle({status:'請先登入'},usercheck);
                                }
                                else if(usercheck!=null)
                                {
                                  var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`) // userMap[user.username]
                                  var roots = root[0]
                                  var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
                                  var users = user[0]
                              
                                  let orderby = ctx.request.url.searchParams.get('orderby')
                                  orderby = orderby || 'id'
                                  let op = ctx.request.url.searchParams.get('op')
                                  op = op || 'ASC'
                                    
                                  var posts = postQuery(`select id, username, title, date,file,content from posts WHERE(title LIKE '%花蓮%') AND (date LIKE '%實習%') group by title `)
                                  ctx.response.body = await render.mechanism(posts,usercheck.username);
                                  }
                              
                                }
async function mechanism_y(ctx) {
                                  var usercheck = await ctx.state.session.get('user')
                                  if(usercheck==null)
                                  {
                                    ctx.response.body = render.middle({status:'請先登入'},usercheck);
                                  }
                                  else if(usercheck!=null)
                                  {
                                    var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`) // userMap[user.username]
                                    var roots = root[0]
                                    var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
                                    var users = user[0]
                                
                                    let orderby = ctx.request.url.searchParams.get('orderby')
                                    orderby = orderby || 'id'
                                    let op = ctx.request.url.searchParams.get('op')
                                    op = op || 'ASC'
                                      
                                    var posts = postQuery(`select id, username, title, date,file,content from posts WHERE(title LIKE '%宜蘭%') AND (date LIKE '%實習%') group by title `)
                                    ctx.response.body = await render.mechanism(posts,usercheck.username);
                                    }
                                
                                  }
async function mechanism_n(ctx) {
                                    var usercheck = await ctx.state.session.get('user')
                                    if(usercheck==null)
                                    {
                                      ctx.response.body = render.middle({status:'請先登入'},usercheck);
                                    }
                                    else if(usercheck!=null)
                                    {
                                      var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`) // userMap[user.username]
                                      var roots = root[0]
                                      var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
                                      var users = user[0]
                                  
                                      let orderby = ctx.request.url.searchParams.get('orderby')
                                      orderby = orderby || 'id'
                                      let op = ctx.request.url.searchParams.get('op')
                                      op = op || 'ASC'
                                        
                                      var posts = postQuery(`select id, username, title, date,file,content from posts WHERE(title LIKE '%南投%') AND (date LIKE '%實習%') group by title `)
                                      ctx.response.body = await render.mechanism(posts,usercheck.username);
                                      }
                                  
                                    }
async function mechanism_p(ctx) {
                                      var usercheck = await ctx.state.session.get('user')
                                      if(usercheck==null)
                                      {
                                        ctx.response.body = render.middle({status:'請先登入'},usercheck);
                                      }
                                      else if(usercheck!=null)
                                      {
                                        var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`) // userMap[user.username]
                                        var roots = root[0]
                                        var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
                                        var users = user[0]
                                    
                                        let orderby = ctx.request.url.searchParams.get('orderby')
                                        orderby = orderby || 'id'
                                        let op = ctx.request.url.searchParams.get('op')
                                        op = op || 'ASC'
                                          
                                        var posts = postQuery(`select id, username, title, date,file,content from posts WHERE(title LIKE '%澎湖%') AND (date LIKE '%實習%') group by title `)
                                        ctx.response.body = await render.mechanism(posts,usercheck.username);
                                        }
                                    
                                      }
async function mechanism_k(ctx) {
                                        var usercheck = await ctx.state.session.get('user')
                                        if(usercheck==null)
                                        {
                                          ctx.response.body = render.middle({status:'請先登入'},usercheck);
                                        }
                                        else if(usercheck!=null)
                                        {
                                          var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`) // userMap[user.username]
                                          var roots = root[0]
                                          var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
                                          var users = user[0]
                                      
                                          let orderby = ctx.request.url.searchParams.get('orderby')
                                          orderby = orderby || 'id'
                                          let op = ctx.request.url.searchParams.get('op')
                                          op = op || 'ASC'
                                            
                                          var posts = postQuery(`select id, username, title, date,file,content from posts WHERE(title LIKE '%金門縣%') AND (date LIKE '%實習%') group by title `)
                                          ctx.response.body = await render.mechanism(posts,usercheck.username);
                                          }
                                      
                                        }                        
async function mechanism_l(ctx) {
                                          var usercheck = await ctx.state.session.get('user')
                                          if(usercheck==null)
                                          {
                                            ctx.response.body = render.middle({status:'請先登入'},usercheck);
                                          }
                                          else if(usercheck!=null)
                                          {
                                            var root = userQuery(`SELECT id, account, password, username FROM users_teacher WHERE username='${usercheck.username}'`) // userMap[user.username]
                                            var roots = root[0]
                                            var user = userQuery(`SELECT id, account, password, username FROM users_student WHERE username='${usercheck.username}'`)
                                            var users = user[0]
                                        
                                            let orderby = ctx.request.url.searchParams.get('orderby')
                                            orderby = orderby || 'id'
                                            let op = ctx.request.url.searchParams.get('op')
                                            op = op || 'ASC'
                                              
                                            var posts = postQuery(`select id, username, title, date,file,content from posts WHERE(title LIKE '%連江%') AND (date LIKE '%實習%') group by title `)
                                            ctx.response.body = await render.mechanism(posts,usercheck.username);
                                            }
                                        
                                          }
                                          



console.log('Server run at http://127.0.0.1:8025/home');

await app.listen({port: 8025 });