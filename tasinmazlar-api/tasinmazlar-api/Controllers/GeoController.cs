using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Npgsql;
using System.Collections.Generic;

namespace tasinmazlar_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GeoController : ControllerBase
    {
        private readonly string connectionString = "Host=localhost;Username=postgres;Password=mawkaw92ofk3l;Database=project-estates";

        [HttpGet]
        public IActionResult GetGeoData()
        {
            List<object> features = new List<object>();

            using (var connection = new NpgsqlConnection(connectionString))
            {
                connection.Open();

                var command = new NpgsqlCommand("SELECT ST_AsGeoJSON(the_geom) AS geom_json FROM nyc_buildings", connection);
                var reader = command.ExecuteReader();

                while (reader.Read())
                {
                    var geomJson = reader["geom_json"].ToString();
                    if (!string.IsNullOrEmpty(geomJson))
                    {
                        var feature = JsonConvert.DeserializeObject<object>(geomJson);
                        features.Add(feature);
                    }
                }
            }

            var geoJson = new { type = "FeatureCollection", features = features };
            return Ok(JsonConvert.SerializeObject(geoJson));
        }
    }
}
