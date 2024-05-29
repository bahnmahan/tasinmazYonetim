using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using tasinmazlar_api.Data;
using tasinmazlar_api.Dtos;
using tasinmazlar_api.Models;

namespace tasinmazlar_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private IAuthRepository _authRepository;
        private IConfiguration _configuration;

        public AuthController(IAuthRepository authRepository, IConfiguration configuration)
        {
            _authRepository = authRepository;
            _configuration = configuration;
        }

        [HttpPost("register")]

        public async Task<IActionResult> Register([FromBody]UserForRegisterDto userForRegisterDto) // userForRegisterDto bodyden username ve password modeli alıyoruz.
        {

            if (await _authRepository.UserExist(userForRegisterDto.mailadress)) // _authRepository'de usernamenin karşılığı var ise kayıt olmak isteyen kullanıcıya "Username Already Exist" uyarısı gönderiyoruz.
            {
                ModelState.AddModelError("UserName", "Username Already Exist");
          
            }

            if(!ModelState.IsValid)  // Eğer girilen değer tutulmak istenen veri türüne mesela varchar(10) kısıma 15 karakterli bir username girilirse BadRequest hatası döndürüyoruz.
            {
                return BadRequest(ModelState);
            }

            var userToCreate = new User  // Eğer kayıt olmak isteyen kullanıcı yukarıdaki aksiyonları geçerse burada kendine geçerli bir kullanıcı adı giriyor.
            {
                mailadress = userForRegisterDto.mailadress,
                username = userForRegisterDto.username,
                userlastname = userForRegisterDto.userlastname,
                useradress = userForRegisterDto.useradress,
                userrole = userForRegisterDto.userrole

            };

            var createdUser = await _authRepository.Register(userToCreate, userForRegisterDto.password); // aynı şekilde oluşturulan kullanıcı adıyla beraber bir parola oluşturmasını istiyoruz.
            return StatusCode(201, createdUser); // 201 created -- eğer kullanıcı kaydı sorunsuz oluşturulduysa 201 Created cevabı döner.

        }

        [HttpPost("login")]

        public async Task<ActionResult> Login([FromBody] UserForLoginDto userForLoginDto)
        {

            var user = await _authRepository.Login(userForLoginDto.mailadress, userForLoginDto.password);

            if (user == null)
            {
                return Unauthorized("Kullanıcı Bulunamadı");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration.GetSection("AppSettings:Token").Value);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                     new Claim(ClaimTypes.NameIdentifier, user.id.ToString()),
                     new Claim(ClaimTypes.Name,user.mailadress),
                     new Claim("userrole", user.userrole) // Kullanıcı rolünü ekleyin
                }),

                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);


            return Ok(new { tokenString });  // Burada sunucudan (postgresql) dönen string ifadeyi json formatında alıyoruz.


        }

    }
}
