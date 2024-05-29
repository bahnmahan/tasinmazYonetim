using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;

namespace tasinmazlar_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CitiesController : ControllerBase
    {

        private readonly IConfiguration tasinmazCityConf;

        public CitiesController(IConfiguration configuration)
        {
            tasinmazCityConf = configuration;
        }

        [HttpGet]

        public JsonResult Get()
        {
            string query = @"
                select cityid as ""cityid"",
                cityname as ""cityname""
                from cities
                ";

            DataTable table = new DataTable();
            string sqlDataSource = tasinmazCityConf.GetConnectionString("getConnectionHere");
            NpgsqlDataReader citiesReader;
            using(NpgsqlConnection citiesConnection = new NpgsqlConnection(sqlDataSource))
            {
                citiesConnection.Open();
                using(NpgsqlCommand citiesCommand = new NpgsqlCommand(query, citiesConnection))
                {
                    citiesReader = citiesCommand.ExecuteReader();
                    table.Load(citiesReader);

                    citiesReader.Close();
                    citiesConnection.Close();
                }
            }

            return new JsonResult(table);

        }

    }
}
