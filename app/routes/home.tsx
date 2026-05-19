import { ArrowRight, ArrowUpRight, Clock, Layers } from "lucide-react";
import Navbar from "../../components/Navbar";
import type { Route } from "./+types/home";
import Button from "../../components/Button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="home">
      <Navbar />
      
      <section className="hero">
        <div className="announce">
          <div className="dot">
            <div className="pulse"></div>
          </div>

          <p>Introducing Roomify 2.0</p>
        </div>

        <h1>Build Beautiful spaces at the speed of thought with Roomify</h1>

        <p className="subtitle">
          Roomify is an Ai-first design environment that helps you visualize, render, and ship architectural projects faster than ever.
        </p>

        <div className="actions">
          <a href="#upload" className="cta">
            Start Building <ArrowRight className="icon" />
          </a>

          <Button variant="outline" size="lg" className="demo">
            Watch Demo
          </Button>
        </div>

        <div id="upload" className="upload-shell">
           <div className="grid-overlay" />
              <div className="upload-card">
                <div className="upload-head">
                  <div className="upload-icon">
                    <Layers className="icon"/>
                  </div>

                  <h3>Upload your Floor Plan</h3>
                  <p>Supports JPG, PNG, formats up to 10MB</p>
                </div>
                <p>Upload Images</p> 
              </div>


        </div>

      </section>

      <section className="projects"> 
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <h2>Projects</h2>
              <p>Your Latest Work and shared community projects, all in one place.</p>
            </div>
          </div>

          <div className="projects-grid">
              <div className="project-card group">
                <div className="preview"> 
                  <img src="https://roomify-mlhuk267-dfwu1i.puter.site/projects/1770803585402/rendered.png" alt="Project Preview" />

                  <div className="badge">
                    <span>Community</span>
                  </div>


                </div>

                <div className="card-body">
                  <div>
                    <h3>Project Manhatten</h3>
                    <div className="meta">
                      <Clock size={12}/>
                      <span>{new Date('01/01/2027').toLocaleDateString()}</span>
                      <span>By John Doe</span>
                    </div>
                  </div>
                  <div className="arrow">
                    <ArrowUpRight size={18}/>
                  </div>
                </div>

              </div>
          </div>

        </div>
      </section>
      
    </div>
  );
}
