export function layout(title, content) {
  return `
  <html>
  <head>
  
    <title>${title}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=2.0, user-scalable=yes" />
    <style>
    body {
      
      background-color:  #D1E9E9;
        font-family: Arial, Helvetica, sans-serif;
        padding: 100px;
        font: 16px Helvetica, Arial;
      }


    #bodylogin {
      
      background-color:  #D1E9E9;
        font-family: Arial, Helvetica, sans-serif;
        padding: 100px;
        font: 16px Helvetica, Arial;
      }
    

    .formloginright
    {
      position: absolute;
      background-color: #FFC1E0 ;
      width:450px;
      height:450px;
      border-radius:999em;
      text-align: center;
      display: inline-block;
      top: 25%;
      left: 55%;
     
      
    }

    .formloginleft
    {
      position: absolute;
      background-color: #FFC1E0 ;
      width:450px;
      height:450px;
      border-radius:999em;
      text-align: center;
      display: inline-block;
      top: 25%;
      left:20%;
     
      
      
    }

    
  
      h1 {
        font-size: 2em;
      }

      h2 {
        font-size: 1.2em;
      }
  
      #posts {
        margin: 0;
        padding: 0;
      }
  
      #posts li {
        padding: 20px;
        border-style:solid;
        list-style: none;
      }
  
     
  
      textarea {
        width: 500px;
        height: 300px;
      }
  
      input[type=text],input[type=password],
      textarea {
        border: 1px solid #eee;
        border-radius: 2px;
        padding: 15px;
        font-size: .8em;
      }
  
      input[type=text],input[type=password] {
        width: 500px;
      }

      header{
        font-size: 50px;
        font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
         background-color:cyan;
         margin-top: -80px;
         text-align: center;
         height:70px;
      }
     
      article{
        width:auto;
        height:auto;
      }
      
    main
    {
      
      height:300px;
      width:300px;
    }
    
    </style>
  </head>
 
  ${content}
 
  </html>
  `
}

export function loginUi(args={})  {
  var alertScript
  var alertScriptshow
  var alertScriptstu
  if (args.status == '這是傳給老師的') {
    alertScript = `<p>帳號或密碼有誤<p>`
    alertScriptstu = ''
    alertScriptshow = ''
  } 

  else if (args.status == '這是傳給學生的') {
    alertScript = ''
    alertScriptshow = ''
    alertScriptstu = `<p>帳號或密碼有誤<p>`
  } 

  else if (args.status == '請先登入'||args.status == '不可輸入特殊符號') {
    alertScript = ''
    alertScriptstu = ''
    alertScriptshow = `<script>
    alert('${args.status}')
    </script>`
  } 
  
  else {
    alertScript = ''
    alertScriptstu = ''
    alertScriptshow = ''
  }
  return layout('Login', `
  <body id="bodylogin">
  ${alertScriptshow}

  <div class="formloginleft">
  <h1>教師端登入</h1>
  
  <form action="/login" method="post" >
    <p><input type="text" placeholder="帳號"  name="username" style="width:auto;"></p>
    <p><input type="password" placeholder="密碼" name="password" style = "width:auto;"></p>
    <p><input type="submit" value="登入"></p>
  </form>
 <p>${alertScript}</p>
 
 <p>1.教師帳號皆擁有最高權限</p>
 <p>2.所有文章皆可自由編輯</p>
 <p>3.可管理所有帳號及密碼</p>
 <p>4.務必保管好自身帳號密碼</p>

 </div>

 <div class="formloginright">
 <h1>學生端登入</h1>
  
 <form action="/loginstu" method="post" >
   <p><input type="text" placeholder="帳號"  name="username" style="width:auto;"></p>
   <p><input type="password" placeholder="密碼" name="password" style = "width:auto;"></p>
   <p><input type="submit" value="登入"></p>
 </form>
<p>${alertScriptstu}</p>

<p>1.教師帳號皆擁有最高權限</p>
<p>2.所有文章皆可自由編輯</p>
<p>3.可管理所有帳號及密碼</p>
<p>4.務必保管好自身帳號密碼</p>
</div>
  </body>
  `)
}

export function signupUi(args={}) {
  var alertScript
  if (args.status != null) {
    console.log('signupUI:alertScript args=', args)
    alertScript = `<script>
    alert('${args.status}')
    </script>`
  } else {
    console.log('signupUI:no alert')
    alertScript = ''
  }
  return layout('Signup',` 
  <h1>Signup</h1>
  <form action="/signup" method="post">
    <p><input type="text" placeholder="帳號" name="username"></p>
    <p><input type="password" placeholder="密碼" name="password"></p>
    <p><input type="text" placeholder="手機號碼" name="email"></p>
    <p><input type="submit" value="Signup"></p>
  </form>
  ${alertScript}
  `
  
  )
}

export function signup_stuUi(args={}) {
  var alertScript
  if (args.status != null) {
    console.log('signupUI:alertScript args=', args)
    alertScript = `<script>
    alert('${args.status}')
    </script>`
  } else {
    console.log('signupUI:no alert')
    alertScript = ''
  }
  return layout('Signup',` 
  <h1>Signup</h1>
  <form action="/addaccount" method="post">
    <p><input type="text" placeholder="學號" name="username"></p>
    <p><input type="password" placeholder="密碼" name="password"></p>
    <p><input type="text" placeholder="手機號碼" name="email"></p>
    <p><input type="submit" value="Signup"></p>
  </form>
  ${alertScript}
  `
  
  )
}



export function changeaccount() {
  return layout('變更密碼', `
  <h1>Success!</h1>
  You may <a href="/">read all Post</a> again !
  `)
}


export function editaccount(users) {
  let list = []
  for (let user of users) {
    list.push(`
    <li style="border-color: crimson">
    <p>帳號${user.username}</p>
      <p>密碼${user.password}</p>
      <p><a href="/delaccount/${user.id}">刪除</a></p>
      <p><a href="/editpassword/${user.id}">編輯</a></p>
      <p><a href="/editpassword/${user.id}">檢視</a></p>
      </li>
    `)
  }
  let content = `
  <body>
  <article>
  <p><a href="/addaccount">新增學生帳號</a><a href="/signup">新增教師帳號</a></p>
  <ul id="posts">
    ${list.join('\n')}
  </ul>
  </article>
  </body>
  `
  return layout('帳號密碼管理', content)
}


export function editpasswordui(user) {
  return layout(user.id, `
 
<body>
  <h1>編輯中${user.id}</h1>
  <p>Create a new post.</p>
  <form action="/change/${user.id}"  method="post">
  <p><input type="text" placeholder="Title" name="username" value="${user.username}"></p>
  <p><textarea placeholder="Contents" name="password" rows="6" cols="40">${user.password}</textarea></p>
    
    <p><input type="submit" value="Create"></p>
  </form>

  </body>
  `)
}


export function success() {
  return layout('Success', `
  <h1>Success!</h1>
  You may <a href="/">read all Post</a> again !
  `)
}

export function fail() {
  return layout('Fail', `
  <h1>請重新登入</h1>
  You may <a href="/">read all Post</a> or <a href="JavaScript:window.history.back()">go back</a> !
  `)
}

export function list(posts, user) {
  console.log('listing: user=', user)
  let list = []
  
  for (let post of posts) {
    
    list.push(`
   
    <li style="border-color: blue">
    <h2>${ post.title} -- by ${post.username}<a href="/delpost/${post.id}">刪除貼文</a><a href="/editpost/${post.id}">編輯貼文</a></h2>
    
      <p>${post.body}</p>
      <p>${post.file}</p>
      <p>${post.content}</p>

      <a href="images/${post.file}">下載點這裡</a>
      
      <p><a href="/post/${post.id}">Read post</a></p>
      </li>
    `)
  }
  let content = `
  <body>
  <article>
  <p style="border: crimson;font-size: 30px; border-top: 100px; ">${(user==null)?'':'歡迎 '+user.username}<a href="/post/new">上傳檔案</a><a href="/editaccount">帳號管理</a><a href="/logout">登出</a></p>
  <ul id="posts">
    ${list.join('\n')}
  </ul>
  </article>
  </body>
  `
  return layout('Posts', content)
}


export function liststu(posts, user) {
  console.log('listing: user=', user)
  let list = []
  
  for (let post of posts) {
    
    list.push(`
   
    <li style="border-color: blue">
    <h2>${ post.title} -- by ${post.username}</h2>
    
      <p>${post.body}</p>
      <p>${post.file}</p>
      <p>${post.content}</p>

      <a href="images/${post.file}">下載點這裡</a>
      
      <p><a href="/post/${post.id}">Read post</a></p>
      </li>
    `)
  }
  let content = `
  <body>
  <article>
  <p style="border: crimson;font-size: 30px; border-top: 100px; ">${(user==null)?'':'歡迎 '+user.username}<a href="/post/newstu">上傳檔案</a><a href="/logout">登出</a></p>
  <ul id="posts">
    ${list.join('\n')}
  </ul>
  </article>
  </body>
  `
  return layout('Posts', content)
}





export function newPost(args={}) {
  var alertScript
  if(args.status=='請上傳檔案')
  {
 alertScript=`<script>
  alert('${args.status}')
  </script>`
  }
  else
  alertScript=''
  return layout('New Post',
 
  `    
  <body>
    <h1>新貼文</h1>
    <p>Create a new post.</p>
    <form action="/post" enctype="multipart/form-data" method="post" >
      <p><input type="text" placeholder="Title" name="title"></p>
      
      <p><select name="content">
      <option value="">文章類別</option>
      <option value="兒少">兒少</option>
      <option value="家庭" >家庭</option>
      <option value="身心障礙">身心障礙</option>
      <option value="老人與長照">老人與長照</option>
      <option value="婦女">婦女</option>
      <option value="law">法律與政策</option>
      <option value="Medical">醫務</option>
      <option value="other" >其他</option>
    </select></p>

      <p><textarea placeholder="Contents" name="body"></textarea></p>
      <p>檔案上傳: <input type="file" name="file"/></p>
      <p><input type="submit" value="Create"></p>
    </form>
  </body>
  ${alertScript}
  
  



  `
  )
}


export function newPoststu(args={}) {
  var alertScript
  if(args.status=='請上傳檔案')
  {
 alertScript=`<script>
  alert('${args.status}')
  </script>`
  }
  else
  alertScript=''
  return layout('New Post',
 
  `    
  <body>
    <h1>新貼文</h1>
    <p>Create a new post.</p>
    <form action="/poststu" enctype="multipart/form-data" method="post" >
      <p><input type="text" placeholder="Title" name="title"></p>
      
      <p><select name="content">
      <option value="">文章類別</option>
      <option value="兒少">兒少</option>
      <option value="家庭" >家庭</option>
      <option value="身心障礙">身心障礙</option>
      <option value="老人與長照">老人與長照</option>
      <option value="婦女">婦女</option>
      <option value="law">法律與政策</option>
      <option value="Medical">醫務</option>
      <option value="other" >其他</option>
    </select></p>

      <p><textarea placeholder="Contents" name="body"></textarea></p>
      <p>檔案上傳: <input type="file" name="file"/></p>
      <p><input type="submit" value="Create"></p>
    </form>
  </body>
  ${alertScript}
  
  



  `
  )
}




export function editpostui(post) {
  console.log("近來這裡是嗎1214")
  return layout(post.title, `
 
<body>
  <h1>編輯中${post.id}</h1>
  <p>Create a new post.</p>
  <form action="/${post.id}" enctype="multipart/form-data" method="post">
  <p><input type="text" placeholder="Title" name="title" value="${post.title}"></p>

  
  <p><select name="content">
  <option value="">文章類別</option>
  <option value="兒少">兒少</option>
  <option value="家庭" >家庭</option>
  <option value="身心障礙">身心障礙</option>
  <option value="老人與長照">老人與長照</option>
  <option value="婦女">婦女</option>
  <option value="law">法律與政策</option>
  <option value="Medical">醫務</option>
  <option value="other" >其他</option>
</select></p>

  <p><textarea placeholder="Contents" name="body" rows="6" cols="40">${post.body}</textarea></p>
  <p>檔案上傳: <input type="file" name="file"/></p>
    <p><input type="submit" value="Create"></p>
  </form>
  

  </body>
  `)
}


export function show(post) {
  return layout(post.title, `
  <html>
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
  <body>

    <h1>${post.title} -- by ${post.username}</h1>
    <p>${post.body}</p>
    <p>蝦蝦蝦</p>
    <p>${post.content}</p>
  </body>
  </head>
  </html>
  `)
}
