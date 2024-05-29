using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;

namespace tasinmazlar_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TownsController : ControllerBase
    {

        private readonly IConfiguration townConnection;

        public TownsController(IConfiguration configuration)
        {
            townConnection = configuration;
        }

        [HttpGet]

        public JsonResult Get(int cityid)
        {
            string query = @"
        SELECT districtid AS ""districtid"",
               districtname AS ""ilcename"",
               cityid AS ""cityid""
        FROM districts
        WHERE cityid = @cityid
            ";

            DataTable table = new DataTable();
            string sqlDataSource = townConnection.GetConnectionString("getConnectionHere");
            NpgsqlDataReader townReader;
            using (NpgsqlConnection townConnection = new NpgsqlConnection(sqlDataSource))
            {
                townConnection.Open();
                using (NpgsqlCommand townCommand = new NpgsqlCommand(query, townConnection))
                {
                    // cityid parametresini sorguya ekleyin
                    townCommand.Parameters.AddWithValue("@cityid", cityid);

                    townReader = townCommand.ExecuteReader();
                    table.Load(townReader);

                    townReader.Close();
                    townConnection.Close();
                }
            }

            return new JsonResult(table);
        }


    }
}
