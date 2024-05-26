
using FacturasBack.Data;
using FacturasBack.Models;
using FacturasBack.Repository;
using FacturasBack.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace FacturasBack
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            });
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddScoped<IFacturaRepository,FacturaRepository>();
            builder.Services.AddScoped<IProveedorRepository, ProveedorRepository>();


            builder.Services.AddDbContext<Context>(options => {
                options.UseSqlServer(builder.Configuration.GetConnectionString("Conexion"));
            });

            builder.Services.AddAutoMapper(typeof(Program));

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
