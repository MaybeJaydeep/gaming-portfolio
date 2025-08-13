# 🎓 GitHub Student Pack + Free Domain Deployment Guide

## 🎯 What You'll Get FREE with GitHub Student Pack
- **Free .me domain** (worth $18.99/year) from Namecheap
- **Free .tech domain** (worth $49.99/year) from get.tech
- **Free hosting credits** for various platforms
- **Plus 100+ other developer tools**

## 📋 Step-by-Step Complete Guide

### Phase 1: Claim GitHub Student Pack (10 minutes)

#### Step 1: Verify Student Status
1. Go to [education.github.com/pack](https://education.github.com/pack)
2. Click **"Get Student Benefits"**
3. Sign in with your GitHub account
4. Click **"Get the Pack"**

#### Step 2: Verify Your Student Status
You'll need ONE of these:
- **School email** (ends with .edu or your college domain)
- **Student ID card** (photo)
- **Enrollment verification** document
- **Academic transcript**

#### Step 3: Fill Application
```
School name: Gujarat Technological University
Graduation year: 2026
How do you plan to use GitHub:
"Building web development projects, contributing to open source,
and creating my professional portfolio for internships and jobs."
```

#### Step 4: Wait for Approval
- Usually approved within **24-48 hours**
- Check email for confirmation
- Some get instant approval

### Phase 2: Claim Your Free Domain (5 minutes)

#### Option A: Free .me Domain (Recommended)
1. **After Student Pack approval**, go to your [Student Pack dashboard](https://education.github.com/pack)
2. Find **"Namecheap"** in the offers
3. Click **"Get access to Namecheap"**
4. Create Namecheap account or login
5. **Claim your free .me domain**:
   - jaydeepbadal.me
   - jaydeep.me
   - badal.me
   - jaydeepdev.me

#### Option B: Free .tech Domain
1. Find **"get.tech"** in Student Pack offers
2. Claim free .tech domain:
   - jaydeepbadal.tech
   - jaydeep.tech
   - badal.tech

### Phase 3: Deploy to Vercel (5 minutes)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Deploy Your Portfolio
```bash
cd gaming-portfolio
vercel
```

**Follow the prompts:**
```
? Set up and deploy "gaming-portfolio"? [Y/n] Y
? Which scope do you want to deploy to? [Your GitHub username]
? Link to existing project? [y/N] N
? What's your project's name? jaydeep-portfolio
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

#### Step 3: Get Your Temporary URL
- Vercel will give you a URL like: `jaydeep-portfolio-xyz.vercel.app`
- **Test this URL first** to ensure everything works

### Phase 4: Connect Your Free Domain (10 minutes)

#### Step 1: Add Domain to Vercel
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your **"jaydeep-portfolio"** project
3. Go to **"Domains"** tab
4. Click **"Add Domain"**
5. Enter your domain: `jaydeepbadal.me`
6. Click **"Add"**

#### Step 2: Configure DNS at Namecheap
1. **Login to Namecheap**
2. Go to **"Domain List"**
3. Click **"Manage"** next to your domain
4. Go to **"Advanced DNS"** tab
5. **Delete all existing records**
6. **Add these records:**

```
Type: A Record
Host: @
Value: 76.76.19.61
TTL: Automatic

Type: CNAME Record
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

#### Step 3: Wait for DNS Propagation
- **Time**: 30 minutes to 48 hours
- **Check status**: Use [whatsmydns.net](https://whatsmydns.net)
- **Vercel will show**: ✅ when domain is ready

### Phase 5: Final Configuration (2 minutes)

#### Step 1: Enable HTTPS (Automatic)
- Vercel automatically provides SSL certificate
- Your site will be available at both:
  - `http://jaydeepbadal.me` → redirects to HTTPS
  - `https://jaydeepbadal.me` ✅

#### Step 2: Set Primary Domain
1. In Vercel dashboard → Domains
2. Click **"Edit"** next to your domain
3. Set as **"Primary Domain"**
4. This redirects vercel.app URL to your custom domain

## 🎉 Success Checklist

After completion, you should have:
- ✅ **GitHub Student Pack** activated
- ✅ **Free domain** claimed (jaydeepbadal.me)
- ✅ **Portfolio deployed** to Vercel
- ✅ **Custom domain** connected
- ✅ **HTTPS enabled** (automatic)
- ✅ **Global CDN** active (fast worldwide)

## 🔧 Troubleshooting

### If Student Pack Application is Rejected:
1. **Try different verification method**
2. **Use school email** if available
3. **Upload clearer student ID photo**
4. **Contact GitHub Education support**

### If Domain Connection Fails:
1. **Double-check DNS records**
2. **Wait longer** (up to 48 hours)
3. **Clear browser cache**
4. **Try incognito mode**

### If Deployment Fails:
1. **Check build locally**: `npm run build`
2. **Fix any errors** in terminal
3. **Try deploying again**: `vercel --prod`

## 💡 Pro Tips

1. **Domain Suggestions Priority:**
   - jaydeepbadal.me (professional)
   - jaydeep.me (short, memorable)
   - badal.me (unique)

2. **After Going Live:**
   - Update LinkedIn profile
   - Add to resume
   - Share with professors/mentors
   - Apply for internships!

3. **Renewal:**
   - .me domain is FREE for 1 year
   - Renew through Student Pack if still student
   - Or transfer to regular registrar

## 📱 Expected Timeline

| Task                   | Time        | Status         |
| ---------------------- | ----------- | -------------- |
| Apply for Student Pack | 10 min      | ⏳ Waiting      |
| Get Pack approval      | 24-48 hrs   | ⏳ Waiting      |
| Claim free domain      | 5 min       | ⏳ Ready        |
| Deploy to Vercel       | 5 min       | ✅ Ready now    |
| Connect domain         | 10 min      | ⏳ After domain |
| DNS propagation        | 30min-48hrs | ⏳ Automatic    |

## 🎯 Final Result

**Your professional portfolio will be live at:**
`https://jaydeepbadal.me`

**Total Cost: $0** (completely free!)
**Professional impact: Priceless** 🚀

---

**Start with the Student Pack application now - approval takes 1-2 days, but everything else can be done quickly once approved!**
