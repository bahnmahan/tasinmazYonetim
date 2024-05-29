using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;
using tasinmazlar_api.Models;

namespace tasinmazlar_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EstatesController : ControllerBase
    {

        private readonly IConfiguration _configuration;

        public EstatesController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]

        public JsonResult Get()
        {
            string query = @"
            select estateId as ""estateId"",
                   estateil as ""estateil"",
                   estateilce as ""estateilce"",
                   estatemahalle as ""estatemahalle"",
                   estateada as ""estateada"",
                   estateparsel as ""estateparsel"",
                   estatenitelik as ""estatenitelik"",
                   estateadres as ""estateadres"",
                   estatecoords as ""estatecoords""
                from Estates
            ";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("getConnectionHere");
            NpgsqlDataReader estateReader;
            using (NpgsqlConnection estateCon = new NpgsqlConnection(sqlDataSource))
            {
                estateCon.Open();
                using (NpgsqlCommand estateCommand = new NpgsqlCommand(query, estateCon))
                {
                    estateReader = estateCommand.ExecuteReader();
                    table.Load(estateReader);

                    estateReader.Close();
                    estateCon.Close();
                }
            }

            return new JsonResult(table);
        }

        [HttpPost]

        public JsonResult Post(Estates est)
        {


            string query = @"insert into estates(estateil,estateilce,estatemahalle,estateada,estateparsel,estatenitelik,estateadres,estatecoords) values (@estateil,@estateilce,@estatemahalle,@estateada,@estateparsel,@estatenitelik,@estateadres,@estatecoords)";


            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("getConnectionHere");
            NpgsqlDataReader estateReader;
            using (NpgsqlConnection estateCon = new NpgsqlConnection(sqlDataSource))
            {
                estateCon.Open();
                using (NpgsqlCommand estateCommand = new NpgsqlCommand(query, estateCon))
                {
                    estateCommand.Parameters.AddWithValue("@estateil", est.estateil);
                    estateCommand.Parameters.AddWithValue("@estateilce", est.estateilce);
                    estateCommand.Parameters.AddWithValue("@estatemahalle", est.estatemahalle);
                    estateCommand.Parameters.AddWithValue("@estateada", est.estateada);
                    estateCommand.Parameters.AddWithValue("@estateparsel", est.estateparsel);
                    estateCommand.Parameters.AddWithValue("@estatenitelik", est.estatenitelik);
                    estateCommand.Parameters.AddWithValue("@estateadres", est.estateadres);
                    estateCommand.Parameters.AddWithValue("@estatecoords", est.estatecoords);
                    estateReader = estateCommand.ExecuteReader();   
                    table.Load(estateReader);

                    estateReader.Close();
                    estateCon.Close();
                }
            }

            return new JsonResult("Added Successfully");      
        }

        [HttpPut]

        public JsonResult Put(Estates est)
        {


            string query = @"update estates set estateil = @estateil where estateId = @estateId;
                             update estates set estateilce = @estateilce where estateId = @estateId;
                             update estates set estatemahalle = @estatemahalle where estateId = @estateId;
                             update estates set estateada = @estateada where estateId = @estateId;
                             update estates set estateparsel = @estateparsel where estateId = @estateId;
                             update estates set estatenitelik = @estatenitelik where estateId = @estateId;
                             update estates set estateadres = @estateadres where estateId = @estateId;
                             update estates set estatecoords = @estaecoords where estateId = @estateId;
                            ";


            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("getConnectionHere");
            NpgsqlDataReader estateReader;
            using (NpgsqlConnection estateCon = new NpgsqlConnection(sqlDataSource))
            {
                estateCon.Open();
                using (NpgsqlCommand estateCommand = new NpgsqlCommand(query, estateCon))
                {
                    estateCommand.Parameters.AddWithValue("@estateId", est.estateId);
                    estateCommand.Parameters.AddWithValue("@estateil", est.estateil);
                    estateCommand.Parameters.AddWithValue("@estateilce", est.estateilce);
                    estateCommand.Parameters.AddWithValue("@estatemahalle", est.estatemahalle);
                    estateCommand.Parameters.AddWithValue("@estateada", est.estateada);
                    estateCommand.Parameters.AddWithValue("@estateparsel", est.estateparsel);
                    estateCommand.Parameters.AddWithValue("@estatenitelik", est.estatenitelik);
                    estateCommand.Parameters.AddWithValue("@estateadres", est.estateadres);
                    estateCommand.Parameters.AddWithValue("@estatecoords", est.estatecoords);
                    estateReader = estateCommand.ExecuteReader();
                    table.Load(estateReader);

                    estateReader.Close();
                    estateCon.Close();
                }
            }

            return new JsonResult("Updated Successfully");
        }

        [HttpDelete("{id}")]

        public JsonResult Delete(int id)
        {


            string query = @"delete from estates where estateId = @estateId";


            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("getConnectionHere");
            NpgsqlDataReader estateReader;
            using (NpgsqlConnection estateCon = new NpgsqlConnection(sqlDataSource))
            {
                estateCon.Open();
                using (NpgsqlCommand estateCommand = new NpgsqlCommand(query, estateCon))
                {

                    estateCommand.Parameters.AddWithValue("@estateId", id);
                    estateReader = estateCommand.ExecuteReader();
                    table.Load(estateReader);

                    estateReader.Close();
                    estateCon.Close();
                }
            }

            return new JsonResult("Deleted Successfully");
        }
    }
}

