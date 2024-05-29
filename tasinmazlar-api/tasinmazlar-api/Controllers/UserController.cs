using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;

namespace tasinmazlar_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly IConfiguration _configuration;

        public UserController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]

        public JsonResult Get()
        {
            string query = @"
            
                    select id as ""id"",
                           mailadress as ""mailadress"",
                           username as ""username"",
                           userlastname as ""userlastname"",
                           useradress as ""useradress"",
                           userrole as ""userrole""
                    from users
             
            ";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("getConnectionHere");
            NpgsqlDataReader userDataReader;
            using (NpgsqlConnection userDataConnection = new NpgsqlConnection(sqlDataSource)) 
            { 
            
                userDataConnection.Open();
                using (NpgsqlCommand userDataCommand = new NpgsqlCommand(query, userDataConnection))
                {

                    userDataReader = userDataCommand.ExecuteReader();
                    table.Load(userDataReader);

                    userDataReader.Close();
                    userDataConnection.Close();

                }

            }

            return new JsonResult(table);

        }


        [HttpDelete("{id}")]

        public JsonResult Delete(int id) 
        {
            string query = @"delete from users where id = @id";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("getConnectionHere");
            NpgsqlDataReader userDataReader;
            using (NpgsqlConnection userDataConnection = new NpgsqlConnection(sqlDataSource))
            {
                userDataConnection.Open();
                using(NpgsqlCommand userDataCommand = new NpgsqlCommand(query, userDataConnection))
                {
                    userDataCommand.Parameters.AddWithValue("@id", id);
                    userDataReader = userDataCommand.ExecuteReader();
                    table.Load(userDataReader);

                    userDataReader.Close();
                    userDataConnection.Close();
                }
            }

            return new JsonResult("User Deleted Successfully");
        }


    }


}
